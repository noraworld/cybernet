# == Schema Information
#
# Table name: buttons
#
#  id         :integer          not null, primary key
#  ip_address :string
#  cookie     :text
#  referrer   :string
#  user_agent :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Button < ApplicationRecord
end
