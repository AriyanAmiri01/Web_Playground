def is_admin(user):
    return user.groups.filter(name="admin").exists()


def is_client(user):
    return user.groups.filter(name="client").exists()


def is_user(user):
    return user.groups.filter(name="user").exists()