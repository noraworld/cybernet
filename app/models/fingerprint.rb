# == Schema Information
#
# Table name: fingerprints
#
#  id          :integer          not null, primary key
#  user_agent  :string
#  referrer    :string
#  screen_size :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Fingerprint < ApplicationRecord
end
