# frozen_string_literal: true

class ButtonsController < ApplicationController
  def show
    headers.delete('X-Frame-Options')

    unless params[:text] == nil
      @share_url = '/share?text=' + params[:text].tr(' ', '+')
    else
      @share_url = '/share'
    end
  end
end
