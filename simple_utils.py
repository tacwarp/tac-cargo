# simple_utils.py - A tiny utility library

def reverse_string(text):
    """
    Return the input string with its characters in reverse order.
    
    Parameters:
        text (str): The string to reverse.
    
    Returns:
        reversed_text (str): A new string containing the characters of `text` in reverse order.
    """
    return text[::-1]

def count_words(sentence):
    """
    Count the words in a sentence by splitting on whitespace.
    
    Parameters:
        sentence (str): Input text; words are separated by any whitespace.
    
    Returns:
        int: Number of words in the input sentence.
    """
    return len(sentence.split())

def celsius_to_fahrenheit(celsius):
    """
    Convert a temperature from Celsius to Fahrenheit.
    
    Parameters:
        celsius (float | int): Temperature in degrees Celsius.
    
    Returns:
        float: Temperature in degrees Fahrenheit.
    """
    return (celsius * 9/5) + 32