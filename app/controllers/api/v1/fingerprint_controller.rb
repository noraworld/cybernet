# frozen_string_literal: true

class Api::V1::FingerprintController < Api::BaseController
  respond_to :json

  def create
    response = Fingerprint.create(user_agent: params[:user_agent], referrer: params[:referrer], screen_size: params[:screen_size])
    render json: response
  end
end
