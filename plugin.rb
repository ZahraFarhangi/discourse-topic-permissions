# plugin.rb
# frozen_string_literal: true

enabled_site_setting :topic_permissions_enabled

register_asset "javascripts/discourse/initializers/topic-permissions.js"

after_initialize do
  Topic.register_custom_field_type('allowed_user_ids', :array)
  Topic.register_custom_field_type('allowed_group_ids', :array)

  add_to_serializer(:topic_view, :allowed_user_ids) do
    object.topic.custom_fields['allowed_user_ids']
  end

  add_to_serializer(:topic_view, :allowed_group_ids) do
    object.topic.custom_fields['allowed_group_ids']
  end

  Discourse::Application.routes.append do
    post "/topic-permissions" => "topic_permissions#save"
  end

  class ::TopicPermissionsController < ApplicationController
    def save
      topic = Topic.find_by(id: params[:topic_id])
      raise Discourse::NotFound if topic.blank?

      topic.custom_fields['allowed_user_ids'] = params[:users]
      topic.custom_fields['allowed_group_ids'] = params[:groups]
      topic.save_custom_fields
      render json: success_json
    end
  end

  TopicGuardian.class_eval do
    def can_see_topic?(topic)
      allowed_users = topic.custom_fields['allowed_user_ids'] || []
      allowed_groups = topic.custom_fields['allowed_group_ids'] || []

      return true if allowed_users.include?(user.id.to_s)
      return true if allowed_groups.any? { |g| user.groups.pluck(:id).include?(g.to_i) }

      false
    end
  end
end
