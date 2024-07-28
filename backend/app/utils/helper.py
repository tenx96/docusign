
import uuid
import random

def generate_unique_client_id():
    
    unique_id = str(uuid.uuid4())

    random_number = ''.join([str(random.randint(0, 9)) for _ in range(3)])

    return f"{unique_id+str(random_number)}"