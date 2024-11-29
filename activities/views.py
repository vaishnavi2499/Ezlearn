from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserScore
from django.contrib.auth.decorators import login_required
import random
import matplotlib.pyplot as plt
import base64
from django.http import  HttpResponse
import io
from django.db.models import Sum

@login_required
def games(request):
    return render(request, 'act.html')

@login_required
def numatch(request):
    return render(request, 'numatch.html')

@login_required
def lsm(request):
    return render(request, 'letterM.html')

@login_required
def imageW(request):
    return render(request, 'imageWo.html')

@login_required
def flc(request):
    return render(request, 'flc.html')


@login_required
def math(request):
    return render(request, 'math.html')


@csrf_exempt  # This will allow POST requests without CSRF token
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        score = data.get('score')
        game_name = data.get('game_name')

        UserScore.objects.create(user=request.user, score=score, game_name=game_name)
        return JsonResponse({'status': 'success', 'message': 'Score saved'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@login_required
def user_progress(request):
    username = request.user.username
    scores = UserScore.objects.filter(user=request.user)

    # Group scores by game and calculate total for each game
    game_scores = scores.values('game_name').annotate(total_score=Sum('score'))
    
    # Prepare data for the line chart
    date_scores = scores.values('date_played').annotate(total_score=Sum('score')).order_by('date_played')
    date_data = [date_score['date_played'].strftime('%Y-%m-%d') for date_score in date_scores]
    score_data = [date_score['total_score'] for date_score in date_scores]

    # Calculate total and average scores
    total_score = sum([score['total_score'] for score in game_scores])
    game_count = scores.count()
    average_score = total_score / game_count if game_count else 0

    # Prepare data for Pie Chart
    game_names = [score['game_name'] for score in game_scores]
    score_totals = [score['total_score'] for score in game_scores]

    context = {
        'username' : username,
        'scores': scores,
        'total_score': total_score,
        'average_score': average_score,
        'game_names': json.dumps(game_names),     # Pass game names for the pie chart as JSON
        'score_totals': json.dumps(score_totals),  # Pass score totals for the pie chart as JSON
        'date_data': json.dumps(date_data),        # Pass date data for the line chart as JSON
        'score_data': json.dumps(score_data),      # Pass score data for the line chart as JSON
    }
    return render(request, 'progress.html', context)




@login_required
def get_rhyming_words(request):
    rhyming_words = [
        ("cat", "hat"),
        ("dog", "log"),
        ("bat", "rat"),
        ("car", "star"),
        ("fish", "dish"),
        ("pen", "hen")
    ]
    # Return a shuffled selection of 3 rhyming word pairs
    return random.sample(rhyming_words, 3)

# View function to render the rhyming words game
@login_required
def rhyming_w(request):
    word_options = get_rhyming_words(request)  # No need to pass 'request' here
    # Flatten the list of word pairs into a single list
    word_options_flat = [word for pair in word_options for word in pair]
    random.shuffle(word_options_flat)  # Shuffle the words for the game
    return render(request, 'rhyming.html', {"word_options": word_options_flat})


