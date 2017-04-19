class AddClientTokenToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :client_token, :string
  end
end
