def encode(password):
    return ' '.join([(str(hex(ord(chr(ord(c)*2-30))))[2:]) for c in password])

if __name__ == '__main__':
    password = input('Enter a password: ')
    print(encode(password))
