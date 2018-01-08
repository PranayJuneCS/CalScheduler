class AddFinalEventIdToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :final_event_id, :string
  end
end
