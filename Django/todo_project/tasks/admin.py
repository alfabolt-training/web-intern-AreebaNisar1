
from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at', 'due_date')
    list_filter = ('completed', 'created_at')
    search_fields = ('title', 'description')

admin.site.register(Task, TaskAdmin)

