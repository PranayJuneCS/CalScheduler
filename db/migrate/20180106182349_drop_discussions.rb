class DropDiscussions < ActiveRecord::Migration[5.0]
  def change
    drop_table :discussions
  end
end
