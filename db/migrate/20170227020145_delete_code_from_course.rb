class DeleteCodeFromCourse < ActiveRecord::Migration[5.0]
  def change
    remove_column :courses, :code
  end
end
