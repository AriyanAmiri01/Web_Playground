# context_processors.py
def language_preference(request):
    # This is better that previous one
    language = request.session.get("language")

    if language is None:
        language = request.COOKIES.get("language", "en")

    return {
        "language": language
    }