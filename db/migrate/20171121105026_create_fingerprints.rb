class CreateFingerprints < ActiveRecord::Migration[5.1]
  def change
    create_table :fingerprints do |t|
      t.string :user_agent
      t.string :referrer
      t.string :screen_size

      t.timestamps
    end
  end
end
