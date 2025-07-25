from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer

# Create your views here.
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-updated_at')
    serializer_class= NoteSerializer