from datetime import date


def build_goal_plan_prompt(goal_data):
    today = date.today()

    goal_deadline = goal_data.get("deadline")

    deadline_text = (
        str(goal_deadline)
        if goal_deadline
        else "Không có deadline"
    )

    deadline_rule = (
        "Deadline của milestone và task phải từ ngày hiện tại trở đi, và không được vượt quá deadline của mục tiêu. " 
        if goal_deadline
        else
        "Hãy tự đề xuất deadline hợp lý cho milestone và task. "
        "Tất cả deadline phải từ ngày hiện tại trở đi."
    )

    return f"""
Bạn là một trợ lý AI chuyên lập kế hoạch cho mục tiêu cá nhân của ứng dụng NovaLife.

Ngày hiện tại: {today}

Hãy tạo một kế hoạch rõ ràng, thực tế và có thể thực hiện được cho mục tiêu sau:

Tiêu đề: {goal_data["title"]}
Mô tả: {goal_data.get("description", "")}
Danh mục: {goal_data["category"]}
Mức ưu tiên: {goal_data.get("priority", "medium")}
Deadline của mục tiêu: {deadline_text}

Yêu cầu:

1. Mục tiêu phải được chia thành từ 3 đến 6 milestone.
2. Mỗi milestone phải có từ 2 đến 5 task.
3. Các task phải cụ thể, có thể thực hiện và đo lường được.
4. {deadline_rule}
5. Tất cả deadline được bằng hoặc sau ngày hiện tại: {today}.
   TUYỆT ĐỐI KHÔNG được tạo bất kỳ deadline nào trước {today}.
   Kế hoạch phải bắt đầu từ ngày hiện tại trở đi.
6. Deadline của mỗi task không được vượt quá deadline của milestone chứa task đó.
7. Nếu mục tiêu có deadline, deadline của tất cả milestone và task không được vượt quá deadline của mục tiêu.
8. Nếu mục tiêu không có deadline, hãy tự xây dựng timeline hợp lý bắt đầu từ ngày hiện tại.
9. Thứ tự của milestone và task phải bắt đầu từ 1 và tăng dần liên tục.
10. difficulty chỉ được phép là một trong các giá trị:
    easy
    medium
    hard
11. priority của task chỉ được phép là một trong các giá trị:
    low
    medium
    high
12. estimated_minutes phải là số nguyên dương hoặc null.
13. recommended_hours_per_week phải là số nguyên dương hoặc null.
14. Deadline phải sử dụng định dạng:
    YYYY-MM-DD
15. Tên tất cả field JSON phải giữ nguyên bằng tiếng Anh.
16. Nội dung của title và description phải được viết bằng tiếng Việt.
17. Chỉ trả về JSON hợp lệ.
18. Không sử dụng Markdown.
19. Không thêm giải thích, lời chào hoặc bất kỳ nội dung nào bên ngoài JSON.

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

Hãy kiểm tra lại toàn bộ deadline trước khi trả kết quả.

Không được có bất kỳ deadline nào trước ngày {today}.

Chỉ trả về JSON.
"""