class AddSyncedToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :synced, :boolean, :default => false
  end
end
