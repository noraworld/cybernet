class CookiesController < ApplicationController
  def show
    @users    = User.all
    @sessions = SessionActivation.all
    @cookies  = request.headers[:Cookie].split('; ')
  end
end
