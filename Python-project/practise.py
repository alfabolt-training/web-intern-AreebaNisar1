
# ------------------------- # 1. Simple Calculator # -------------------------
def calculator():
    print("=== Simple Calculator ===")
    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))
    op = input("Enter operation (+, -, *, /): ")

    if op == "+":
        print("Result:", num1 + num2)
    elif op == "-":
        print("Result:", num1 - num2)
    elif op == "*":
        print("Result:", num1 * num2)
    elif op == "/":
        if num2 != 0:
            print("Result:", num1 / num2)
        else:
            print("Error: Division by zero")
    else:
        print("Invalid operation")


# ------------------------- # 2. String Manipulations # -------------------------
def string_ops():
    print("\n=== String Operations ===")
    text = input("Enter a string: ")

    print("Length:", len(text))
    print("First character:", text[0] if text else "N/A")
    print("Last character:", text[-1] if text else "N/A")
    print("Reverse:", text[::-1])
    print("Uppercase:", text.upper())
    print("Lowercase:", text.lower())

    word = input("Enter a word to search: ")
    print(f"'{word}' in string?", word in text)


# ------------------------- # 3. List Operations # -------------------------
def list_ops():
    print("\n=== List Operations ===")
    raw = input("Enter numbers separated by spaces: ")

   
    numbers = [int(n) for n in raw.split()]
    print("List:", numbers)

    print("Numbers in list:")
    for n in numbers:
        print(n)

    print("Sum:", sum(numbers))
    print("Average:", sum(numbers)/len(numbers))

    new_num = int(input("Enter a number to append: "))
    numbers.append(new_num)
    print("After append:", numbers)

    rem = int(input("Enter a number to remove if exists: "))
    if rem in numbers:
        numbers.remove(rem)
        print("After removal:", numbers)
    else:
        print(f"{rem} not found in list")

    numbers.sort()
    print("Sorted:", numbers)

    numbers.reverse()
    print("Reversed:", numbers)


# ------------------------- # 4. Tuples & Dictionaries # -------------------------
def tuple_dict_ops():
    print("\n=== Tuple & Dictionary ===")

   
    raw = input("Enter fruits separated by commas: ")
    fruits = tuple(raw.split(","))
    print("Tuple of fruits:", fruits)

    print("Fruits using loop:")
    for f in fruits:
        print(f)

    print("Tuples are immutable - cannot change items!")

    
    people = {}
    n = int(input("How many people to add? "))

    for _ in range(n):
        name = input("Enter name: ")
        age = int(input("Enter age: "))
        people[name] = age

    print("Dictionary:", people)

    print("People data:")
    for name, age in people.items():
        print(name, ":", age)


# ------------------------- # 5. Functions & Lambda # -------------------------
def is_even(num):
    return num % 2 == 0

def square_list(nums):
    return [x*x for x in nums]

def function_lambda_ops():
    print("\n=== Functions & Lambda ===")
    num = int(input("Enter a number to check even: "))
    print("Is even?", is_even(num))

    square = lambda x: x*x
    print("Square of num using lambda:", square(num))

    raw = input("Enter list of numbers separated by spaces: ")
    nums = [int(n) for n in raw.split()]

    print("Numbers:", nums)
    print("Squares:", square_list(nums))


# ------------------------- # 6. Mini Game - Guess the Number# -------------------------

import random

def guessing_game():
    print("\n=== Guess the Number Game ===")

    number = random.randint(1, 20)
    attempts = 5

    while attempts > 0:
        try:
            guess = int(input(f"Guess a number (1-20). Attempts left {attempts}: "))
        except ValueError:
            print("Please enter a valid number!")
            continue

        if guess < number:
            print("Too low!")
        elif guess > number:
            print("Too high!")
        else:
            print("Congratulations! You guessed it!")
            return

        attempts -= 1

    print(f"Out of attempts! The number was {number}")



## ------------------------- MAIN MENU # -------------------------

def main():
    while True:
        print("\n--- Python Exercises Menu ---")
        print("1. Calculator")
        print("2. String Operations")
        print("3. List Operations")
        print("4. Tuple & Dictionary Operations")
        print("5. Functions & Lambda")
        print("6. Guessing Game")
        print("0. Exit")

        choice = input("Enter choice: ")
        if choice == "1":
            calculator()
        elif choice == "2":
            string_ops()
        elif choice == "3":
            list_ops()
        elif choice == "4":
            tuple_dict_ops()
        elif choice == "5":
            function_lambda_ops()
        elif choice == "6":
            guessing_game()
        elif choice == "0":
            print("Exiting.")
            break
        else:
            print("Invalid choice.")


if __name__ == "__main__":
    main()