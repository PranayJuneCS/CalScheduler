class AddShortAndLongToDepartment < ActiveRecord::Migration[5.0]
  def change
    add_column :departments, :short, :string
    add_column :departments, :long, :string
  end
end
