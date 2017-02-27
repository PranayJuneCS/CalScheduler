class AddNumberToCourse < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :number, :string
  end
end
