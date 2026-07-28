def build_goal_plan_prompt(goal_data):
    return f"""
Bạn là một trợ lý AI chuyên lập kế hoạch cho mục tiêu cá nhân.

Hãy tạo một kế hoạch rõ ràng, thực tế và có thể thực hiện được
cho mục tiêu sau:

Tiêu đề: {goal_data["title"]}
Mô tả: {goal_data.get("description", "")}
Danh mục: {goal_data["category"]}
Mức ưu tiên: {goal_data["priority"]}
Deadline: {goal_data["deadline"]}

Yêu cầu:

1. Mục tiêu chia thành từ 3 đến 6 milestone.
2. Mỗi milestone có từ 2 đến 5 task.
3. Các task phải cụ thể, có thể thực hiện và đo lường được.
4. Deadline của milestone và task không được vượt quá deadline
   của mục tiêu.
5. Thứ tự của milestone và task phải bắt đầu từ 1.
6. difficulty chỉ được là easy, medium hoặc hard.
7. priority của task chỉ được là low, medium hoặc high.
8. estimated_minutes phải là số nguyên dương hoặc null.
9. Tên các field JSON phải giữ nguyên bằng tiếng Anh.
   Giá trị (title, description, milestone, task...) phải được viết bằng tiếng Việt.
10. Chỉ trả về JSON, không thêm markdown hoặc giải thích bên ngoài.


Định dạng JSON bắt buộc:

{{
    "difficulty": "medium",
    "estimated_duration": "...",
    "recommended_hours_per_week": 10,
    "milestones": [
        {{
            "title": "...",
            "description": "...",
            "deadline": "YYYY-MM-DD",
            "order": 1,
            "tasks": [
                {{
                    "title": "...",
                    "description": "...",
                    "priority": "medium",
                    "deadline": "YYYY-MM-DD",
                    "estimated_minutes": 60,
                    "order": 1
                }}
            ]
        }}
    ]
}}
"""