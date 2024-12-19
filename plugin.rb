# name: discourse-topic-permissions
# about: A plugin to add topic-specific access permissions
# version: 0.1
# author: Zahra Farhangi
# url: https://github.com/ZahraFarhangi/discourse-topic-permissions

enabled_site_setting :topic_permissions_enabled

after_initialize do
  # Register custom field for topic
  Topic.register_custom_field_type('allowed_user_ids', :array)

  # Serializer to expose custom field
  add_to_serializer(:topic_view, :allowed_user_ids) do
    object.topic.custom_fields['allowed_user_ids']
  end

  # Event to save allowed users
  DiscourseEvent.on(:topic_created) do |topic, params, user|
    allowed_users = params[:allowed_user_ids] || []
    topic.custom_fields['allowed_user_ids'] = allowed_users
    topic.save_custom_fields
  end

  # Custom Guardian logic
  TopicGuardian.class_eval do
    def can_see_topic?(topic)
      allowed_users = topic.custom_fields['allowed_user_ids']
      return true if allowed_users.blank? || allowed_users.include?(user.id)
      false
    end
  end
end
