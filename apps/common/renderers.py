from rest_framework.renderers import JSONRenderer


class ApiResponseRenderer(JSONRenderer):
    def render(
        self,
        data,
        accepted_media_type=None,
        renderer_context=None,
    ):
        response = renderer_context.get("response")

        if response is None:
            return super().render(
                data,
                accepted_media_type,
                renderer_context,
            )

        if response.status_code == 204:
            return super().render(
                None,
                accepted_media_type,
                renderer_context,
            )

        if 200 <= response.status_code < 300:
            wrapped_data = {
                "success": True,
                "message": "Thành công.",
                "data": data,
            }
        else:
            wrapped_data = data

        return super().render(
            wrapped_data,
            accepted_media_type,
            renderer_context,
        )