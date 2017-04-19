class AddCalIdToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :cal_id, :string
  end
end
