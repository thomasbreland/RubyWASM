class Product < ApplicationRecord
  include Notifications

  has_many :subscribers, dependent: :destroy
  has_one_attached :featured_image
  attribute :description, :text

  validates :name, presence: true
  validates :inventory_count, numericality: { greater_than_or_equal_to: 0 }
end
