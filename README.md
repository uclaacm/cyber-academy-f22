# ctf-starter
A template for deploying challenges to ACM Cyber's [CTF platform](https://github.com/uclaacm/cyber-platform) for Cyber Academy &amp; CTF After Dark. For more information, please see [https://github.com/uclaacm/cyber-platform](https://github.com/uclaacm/cyber-platform).

## Deploying
In order to begin deploying this to the ACM Cyber platform, start by updating ```ctf.toml```. Notice the example fields below.

```
start = 2022-05-18T18:00:00-06:00
stop = 2022-05-25T18:00:00-06:00
```

These indicate the starting and stopping time of the CTF. The platform will not accept flags if the stop time has passed so its important to update this. Be sure to match the correct formatting of the times (here is a resource that can help [convert times](http://www.timestamp-converter.com/)).

Once this is updated, make sure that all of the events and challenges within their corresponding folders pass the TOML checker. With that, you are ready to deploy the [platform](https://github.com/uclaacm/cyber-platform)!
