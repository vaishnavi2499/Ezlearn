from django.db import models
import datetime
from django.contrib.auth.models import User


class UserScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    game_name = models.CharField(max_length=100)  # Name of the game/session
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.game_name} - {self.score}"


