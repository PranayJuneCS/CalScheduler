class AddPrimaryToCourse < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :primary, :boolean, :default => false
  end
end
