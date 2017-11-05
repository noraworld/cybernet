class CreateButtons < ActiveRecord::Migration[5.1]
  def change
    create_table :buttons do |t|
      t.string :ip_address
      t.text :cookie
      t.string :referrer
      t.string :user_agent

      t.timestamps
    end
  end
end
