# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180108215920) do

  create_table "codes", force: :cascade do |t|
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "code"
    t.integer  "department_id"
    t.index ["department_id"], name: "index_codes_on_department_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string   "title"
    t.string   "day"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.integer  "user_id"
    t.boolean  "synced",            default: false
    t.string   "event_id_1"
    t.string   "ccn"
    t.string   "component"
    t.string   "start_time"
    t.string   "end_time"
    t.string   "location"
    t.string   "instructor"
    t.string   "dept"
    t.string   "code"
    t.string   "number"
    t.string   "event_id_2"
    t.boolean  "primary",           default: false
    t.boolean  "has_final_exam",    default: false
    t.string   "final_event_id"
    t.string   "final_exam_string"
    t.index ["user_id"], name: "index_courses_on_user_id"
  end

  create_table "departments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "short"
    t.string   "long"
  end

  create_table "users", force: :cascade do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "email"
    t.string   "image"
    t.string   "client_token"
  end

end
