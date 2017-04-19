class User < ApplicationRecord
  has_many :courses
  
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.image = auth.info.image
      user.email = auth.info.email
      user.oauth_token = auth.credentials.token
      user.client_token = user.generate_client_token(auth.credentials.token)
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end

  def current_ccns
    self.courses.map { |course| course.ccn }
  end

  def client_friendly_version
    user_info = {}
    user_info['id'] = self.id
    user_info['name'] = self.name
    user_info['token'] = self.oauth_token
    user_info['email'] = self.email
    user_info['image'] = self.image
    user_info
  end

  def generate_client_token(oauth_token)
    concat = oauth_token + ENV['secret_token']
    (Digest::SHA256.digest concat).force_encoding('UTF-8')
  end

  def validate_request(token)
    if token.nil?
      return false
    end
    concat = token + ENV['secret_token']
    self.client_token == (Digest::SHA256.digest concat).force_encoding('UTF-8')
  end
end
