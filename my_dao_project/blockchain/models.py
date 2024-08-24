from django.db import models

class Proposal(models.Model):
    description = models.CharField(max_length=255)
    deadline = models.DateTimeField()
    yes_votes = models.BigIntegerField()
    no_votes = models.BigIntegerField()
    executed = models.BooleanField(default=False)
    blockchain_txn_hash = models.CharField(max_length=255)

    def __str__(self):
        return self.description

class Vote(models.Model):
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE)
    voter_address = models.CharField(max_length=42)
    support = models.BooleanField()

    def __str__(self):
        return f"Vote by {self.voter_address} on {self.proposal}"
