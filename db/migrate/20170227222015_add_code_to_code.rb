class AddCodeToCode < ActiveRecord::Migration[5.0]
  def change
    add_column :codes, :code, :string
    add_reference :codes, :department, foreign_key: true
  end
end
