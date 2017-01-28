class CreateDiscussions < ActiveRecord::Migration[5.0]
  def change
    create_table :discussions do |t|
      t.string :day
      t.string :time
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
