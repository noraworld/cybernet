# frozen_string_literal: true

class ButtonsController < ApplicationController
  def show
    headers.delete('X-Frame-Options')

    Button.create(ip_address: request.remote_ip, cookie: request.headers[:Cookie], referrer: request.headers[:Referer], user_agent: request.headers[:HTTP_USER_AGENT])

    unless params[:text] == nil
      @share_url = '/share?text=' + params[:text].tr(' ', '+')
    else
      @share_url = '/share'
    end
  end
end
