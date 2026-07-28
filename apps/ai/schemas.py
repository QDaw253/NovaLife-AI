GOAL_PLAN_SCHEMA = {
    "type": "object",
    "properties": {
        "difficulty": {
            "type": "string",
            "enum": ["easy", "medium", "hard"],
        },
        "estimated_duration": {
            "type": "string",
        },
        "recommended_hours_per_week": {
            "type": "integer",
            "minimum": 1,
        },
        "plan_data": {
            "type": "object",
        },
        "milestones": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                    },
                    "description": {
                        "type": "string",
                    },
                    "deadline": {
                        "type": ["string", "null"],
                    },
                    "order": {
                        "type": "integer",
                        "minimum": 1,
                    },
                    "tasks": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {
                                    "type": "string",
                                },
                                "description": {
                                    "type": "string",
                                },
                                "priority": {
                                    "type": "string",
                                    "enum": [
                                        "low",
                                        "medium",
                                        "high",
                                    ],
                                },
                                "deadline": {
                                    "type": ["string", "null"],
                                },
                                "estimated_minutes": {
                                    "type": ["integer", "null"],
                                },
                                "order": {
                                    "type": "integer",
                                    "minimum": 1,
                                },
                            },
                            "required": [
                                "title",
                                "description",
                                "priority",
                                "deadline",
                                "estimated_minutes",
                                "order",
                            ],
                        },
                    },
                },
                "required": [
                    "title",
                    "description",
                    "deadline",
                    "order",
                    "tasks",
                ],
            },
        },
    },
    "required": [
        "difficulty",
        "estimated_duration",
        "recommended_hours_per_week",
        "plan_data",
        "milestones",
    ],
}