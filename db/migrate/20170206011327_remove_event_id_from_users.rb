class RemoveEventIdFromUsers < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :eventId
  end
end
