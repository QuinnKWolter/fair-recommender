from django.contrib import admin

from .models import Movie, Tags, Links, Ratings, Genome_Tags, Genome_Scores

# Register your models here.
admin.site.register(Movie)
admin.site.register(Tags)
admin.site.register(Links)
admin.site.register(Ratings)
admin.site.register(Genome_Tags)
admin.site.register(Genome_Scores)