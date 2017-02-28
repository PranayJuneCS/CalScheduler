Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'
  get 'add', to: "home#add"
  get 'search', to: "home#search"

  post 'add_class', to: "home#add_class"
  post 'sync_classes', to: "home#sync_classes"
  post 'delete_class', to: "home#delete_class"
  get 'classes_from_dept', to: "home#classes_from_dept"

  get 'choose', to: "home#choose"

  get 'ccn', to: "home#ccn"
  get 'ccn_search', to: "home#ccn_search"

  get 'course', to: "home#course"
  get 'codes_from_dept', to: "home#codes_from_dept"
  get 'course/*dept/*code', to: "home#specific_course", :constraints => { :code => /[^\/]+/ }
  get 'all_courses', to: "home#all_courses"

  resources :sessions, only: [:create, :destroy]
  resource :home, only: [:show]

  root to: "home#show"
end
