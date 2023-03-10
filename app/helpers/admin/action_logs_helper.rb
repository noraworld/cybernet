# frozen_string_literal: true

module Admin::ActionLogsHelper
  def log_target(log)
    if log.target
      linkable_log_target(log.target)
    else
      log_target_from_history(log.target_type, log.recorded_changes)
    end
  end

  def linkable_log_target(record)
    case record.class.name
    when 'Account'
      link_to record.acct, admin_account_path(record.id)
    when 'User'
      link_to record.account.acct, admin_account_path(record.account_id)
    when 'CustomEmoji'
      record.shortcode
    when 'Report'
      link_to "##{record.id}", admin_report_path(record)
    when 'DomainBlock', 'EmailDomainBlock'
      link_to record.domain, "https://#{record.domain}"
    when 'Status'
      link_to record.account.acct, TagManager.instance.url_for(record)
    end
  end

  def log_target_from_history(type, attributes)
    case type
    when 'CustomEmoji'
      attributes['shortcode']
    when 'DomainBlock', 'EmailDomainBlock'
      link_to attributes['domain'], "https://#{attributes['domain']}"
    when 'Status'
      tmp_status = Status.new(attributes)
      link_to tmp_status.account.acct, TagManager.instance.url_for(tmp_status)
    end
  end

  def relevant_log_changes(log)
    if log.target_type == 'CustomEmoji' && [:enable, :disable, :destroy].include?(log.action)
      log.recorded_changes.slice('domain')
    elsif log.target_type == 'CustomEmoji' && log.action == :update
      log.recorded_changes.slice('domain', 'visible_in_picker')
    elsif log.target_type == 'User' && [:promote, :demote].include?(log.action)
      log.recorded_changes.slice('moderator', 'admin')
    elsif log.target_type == 'DomainBlock'
      log.recorded_changes.slice('severity', 'reject_media')
    elsif log.target_type == 'Status' && log.action == :update
      log.recorded_changes.slice('sensitive')
    end
  end

  def log_extra_attributes(hash)
    safe_join(hash.to_a.map { |key, value| safe_join([content_tag(:span, key, class: 'diff-key'), '=', log_change(value)]) }, ' ')
  end

  def log_change(val)
    return content_tag(:span, val, class: 'diff-neutral') unless val.is_a?(Array)
    safe_join([content_tag(:span, val.first, class: 'diff-old'), content_tag(:span, val.last, class: 'diff-new')], '???')
  end

  def icon_for_log(log)
    case log.target_type
    when 'Account', 'User'
      'user'
    when 'CustomEmoji'
      'file'
    when 'Report'
      'flag'
    when 'DomainBlock'
      'lock'
    when 'EmailDomainBlock'
      'envelope'
    when 'Status'
      'pencil'
    end
  end

  def class_for_log_icon(log)
    case log.action
    when :enable, :unsuspend, :unsilence, :confirm, :promote, :resolve
      'positive'
    when :create
      opposite_verbs?(log) ? 'negative' : 'positive'
    when :update, :reset_password, :disable_2fa, :memorialize
      'neutral'
    when :demote, :silence, :disable, :suspend
      'negative'
    when :destroy
      opposite_verbs?(log) ? 'positive' : 'negative'
    else
      ''
    end
  end

  private

  def opposite_verbs?(log)
    %w(DomainBlock EmailDomainBlock).include?(log.target_type)
  end
end
