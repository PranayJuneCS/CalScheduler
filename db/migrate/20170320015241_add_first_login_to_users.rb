class AddFirstLoginToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :first_time, :boolean, :default => true
  end
end
