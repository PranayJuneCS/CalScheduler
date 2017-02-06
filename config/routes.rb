Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'
  get 'add', to: "home#add"

  post 'add_class', to: "home#add_class"
  post 'sync_class', to: "home#sync_class"
  post 'unsync_class', to: "home#unsync_class"

  resources :sessions, only: [:create, :destroy]
  resource :home, only: [:show]

  root to: "home#show"
end
