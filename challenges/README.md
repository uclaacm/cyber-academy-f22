# Challenges
Follow the format of the ```example/challenge.toml``` to create a challenge!

## Creating Challenges
Each challenge should correspond to a directory within the `challenges/` directory. Make sure to push both source and compiled Linux executable. Also check that the executable runs on the SEASnet servers.

Regarding `challenge.toml`, follow this [example](https://github.com/uclaacm/cyber-academy-s20/blob/update_main/encompress/challenge.toml). Some things to keep in mind:
* Aim for `value` to range between 10 and 100.
* If you're presenting the next week, set `enabled` to true; otherwise, false.
* Your first tag should signify which workshop the challenge comes from. For example, "file" for File Analysis, "packet" for Packet Captures, "memory" for Memory Forensics.
* `files` should contain relative paths, `description` should link by filename.
