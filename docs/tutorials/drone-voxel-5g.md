# Overview

#Usefull commands:
```
#Enable /dev/ttyUSB0 and /dev/ttyUSB1
echo 1199 90e3 > /sys/bus/usb-serial/drivers/option1/new_id

tio /dev/ttyUSB0
at
ate1

#Password check:
at!usbcomp?
ERROR
at!entercnd="A710"
OK
at!usbcomp?
Config Index: 1
#make new band:
AT!BAND=5,1,"n78",4,0000000000000000,0000000000002000,0000000000000000,0000000000000000,0000000000000000
OK
Select Said Band:
AT!BAND=5
OK



ki: 465b5ce8b199b49faa5f0a2ee238a6bc
opc: e8ed289deba952e4283b54e88e6183ca
imsi: 001010123456789
```

`AT+CGACT=1,1`

# Documentation 


https://www.modalai.com/products/voxl-2-flight-deck?variant=40503626006579

HW Documentation: This one seems like a good start. 
https://beta-docs.modalai.com/voxl2-flight-deck-userguide/

# Part 1 Hacking In.

These are my setup steps I'll write them as I go through things. 

## Power

There is a 120VAC adapater to Yellow 12V. it looks like it's a drop in replacement for a battery! Looks great. I don't want to play with batteries to setup the 5G modem. Let's plug it in!

.. Waiting... waiting... 

oo0o0o after about 10s the system lights up! 
<img width="900" alt="image" src="https://github.com/user-attachments/assets/573a8d03-3efd-4e79-88ea-738f522787e1" />
green lights and Blinky blues. 
Okay!

# software

it says to run `adb shell` I guess the hat runs android OS. 

```bash
eric@M70q:~$ adb devices
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
573b50ef	no permissions (user in plugdev group; are your udev rules wrong?); see [http://developer.android.com/tools/device.html]


# and ...
eric@M70q:~$ adb shell
error: insufficient permissions for device: user in plugdev group; are your udev rules wrong?
See [http://developer.android.com/tools/device.html] for more information
```

hmmmm

some google-fu  https://askubuntu.com/questions/1033017/adbcommandrejectedexception-insufficient-permissions-for-device-user-in-plugde
says to do this:
```
Adding a file /etc/udev/rules.d/51-android.rules

SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="d002", MODE="0660", 
GROUP="plugdev", SYMLINK+="android%n"
(lsusb → 18d1:d002)

And plugging in and out did the work for me. Now, the device is in the plugdev group.
```

so lets do that:
```
eric@M70q:~$ lsusb 
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 004: ID 2500:0020 Ettus Research LLC USRP B210
Bus 001 Device 003: ID 1dd2:2443 Leo Bodnar Electronics Ltd LBE-1420 GPS Locked Clock Source
Bus 001 Device 007: ID 05c6:901d Qualcomm, Inc. KONA-QRD _SN:5DE1F722
Bus 001 Device 002: ID 2500:0021 Ettus Research LLC USRP B200-mini
Bus 001 Device 005: ID 8087:0aaa Intel Corp. Bluetooth 9460/9560 Jefferson Peak (JfP)
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```
so our device is this Qualcomm, Inc. 

`sudo vi /etc/udev/rules.d/51-android.rules`
```
eric@M70q:~$ cat /etc/udev/rules.d/51-android.rules 
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="901d", MODE="0660",
GROUP="plugdev", SYMLINK+="android%n"
```
and we made that `901d` due to the device id from the `lsusb`

and unplug and replug in the device?

```
eric@M70q:~$ adb devices
List of devices attached
573b50ef	device


# .... oh ???


eric@M70q:~$ adb shell

                                                         ▂▂▂▂▂▂▂▂▂▂▂▂▂            
                                                    ▂▄▆▆██▛▀▀▀▀▀▀▀▀▜████▆▆▄▂      
 ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗         ▗▆████▀▔             ▔▔▀▀▀▀▚▄    
 ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║       ▗▟████▀     ▗██▖    ▐█   ▝▀▆▄▄▄    
 ██╔████╔██║██║   ██║██║  ██║███████║██║      ▟████▀      ▗█▘▝█▖   ▐█       ▜█▀█▄ 
 ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║      █▌ ▐█▌     ▗█▘  ▝█▖  ▐█       ▐▄ ▄█ 
 ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗  ▀████    ▗█▘    ▝█▖ ▐█     ▂▄███▀  
 ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ▀▀██▄▄                ▂▆███▀     
                                                     ▀▀██▄▄ ▀▀▆▄▄▄▄▆██▀▀▀▘        


--------------------------------------------------------------------------------
system-image: 1.7.4-M0054-14.1a-perf
kernel:       #1 SMP PREEMPT Fri Feb 9 21:59:24 UTC 2024 4.19.125
--------------------------------------------------------------------------------
hw platform:  M0054
mach.var:     1.0
--------------------------------------------------------------------------------
voxl-suite:   1.1.3-1
--------------------------------------------------------------------------------
no current network connection
--------------------------------------------------------------------------------


```

HUZZAH!

# Part 2 WE'RE IN.

okay.. there wasn't a SIM card in there... lets put in a SIM card we know works.  

Follow the HW instructions. Take the top hat off. the SIM card goes under. There are 4 corner screws that need to come off to get under the 5G modem and plug in the SIM card. Put the SIM card in there. 

realize there no antenna connected. struggle for 10 mins trying to put an antenna on. Be VERY gentle firm. It's a use your nail sorta thing to get the MH4 style connector on. 

SIM card. Check. 
1 antenna connected.  Check. 

Insert 12V plug. Fire it back on. 


Turn on 5G.... 

``` 
voxl2:/$ voxl-configure-modem 
Starting interactive mode
 
What type of modem are you using?

1) v2	      3) dtc	    5) quectel
2) microhard  4) doodle	    6) em9191
#? 6
 
Are you attempting to connect to ModalLink? (not common)
1) yes
2) no
#? 2
 
Which APN is correct for your SIM card?

AT&T - IoT device - APN: m2m.com.attz
AT&T - Laptop or Tablet - APN: broadband
AT&T - Smartphone - APN: phone
T-Mobile - APN: fast.t-mobile.com
Verizon - APN: vzwinternet
Google Fi - APN: h2g2

1) m2m.com.attz	      4) fast.t-mobile.com  7) Custom
2) broadband	      5) vzwinternet
3) phone	      6) googlefi
#? 7
Please enter a custom APN
internet
 
Select modem region:
1) Americas
2) Europe/Middle-East/Asia
#? 1

qrb5165 based device detected
reloading systemd services
enabling voxl-modem systemd service
Created symlink /etc/systemd/system/multi-user.target.wants/voxl-modem.service → /etc/systemd/system/voxl-modem.service.
starting voxl-modem systemd service
DONE configuring voxl-modem
```

wait for 1 min.. nothing.. power cycle....

nothing... 

notice that there are connections on the bottom of the board. maybe the screw need to be on ignorer to seat those connections. 
power on board while pushing down to seat the connection. 

``` 
eric@M70q:~$ adb shell

                                                         ▂▂▂▂▂▂▂▂▂▂▂▂▂            
                                                    ▂▄▆▆██▛▀▀▀▀▀▀▀▀▜████▆▆▄▂      
 ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗         ▗▆████▀▔             ▔▔▀▀▀▀▚▄    
 ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║       ▗▟████▀     ▗██▖    ▐█   ▝▀▆▄▄▄    
 ██╔████╔██║██║   ██║██║  ██║███████║██║      ▟████▀      ▗█▘▝█▖   ▐█       ▜█▀█▄ 
 ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║      █▌ ▐█▌     ▗█▘  ▝█▖  ▐█       ▐▄ ▄█ 
 ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗  ▀████    ▗█▘    ▝█▖ ▐█     ▂▄███▀  
 ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ▀▀██▄▄                ▂▆███▀     
                                                     ▀▀██▄▄ ▀▀▆▄▄▄▄▆██▀▀▀▘        


--------------------------------------------------------------------------------
system-image: 1.7.4-M0054-14.1a-perf
kernel:       #1 SMP PREEMPT Fri Feb 9 21:59:24 UTC 2024 4.19.125
--------------------------------------------------------------------------------
hw platform:  M0054
mach.var:     1.0
--------------------------------------------------------------------------------
voxl-suite:   1.1.3-1
--------------------------------------------------------------------------------
current IP:   wlan0: 192.168.8.1
--------------------------------------------------------------------------------

```
oh snap. wlan0 is now up... okay. so the screws need to be on... welp.. there are no threads for the screws... 

let me dig around and see if I have something.... 
found me some pi hat stand offs... seems to be pretty okay  

Okay so the wlan0 is getting there... and its reading the Sierra wireless modem... 

reading the side `vol-configure-modem` is what we want... and v2 is the EM9291 which is the Sierra wireless card we have...

```
voxl2:/$ voxl-configure-modem 
Starting interactive mode
 
What type of modem are you using?

1) v2	      3) dtc	    5) quectel
2) microhard  4) doodle	    6) em9191
#? 1
 
Are you attempting to connect to ModalLink? (not common)
1) yes
2) no
#? 2
 
Which APN is correct for your SIM card?

AT&T - IoT device - APN: m2m.com.attz
AT&T - Laptop or Tablet - APN: broadband
AT&T - Smartphone - APN: phone
T-Mobile - APN: fast.t-mobile.com
Verizon - APN: vzwinternet
Google Fi - APN: h2g2

1) m2m.com.attz	      4) fast.t-mobile.com  7) Custom
2) broadband	      5) vzwinternet
3) phone	      6) googlefi
#? 7
Please enter a custom APN
internet
 
Select modem region:
1) Americas
2) Europe/Middle-East/Asia
#? 2

Waiting for ttyUSB2...
```
and it gets stuck here... hmmmm
missing a HW connection? 

# 2025-06-24

was able to press things down... the voxl-modem-start didn't work. 
more reading on their website... go nowhere... 
more reading... 

updated the SDK from 1.1.x to 1.8 and SDK from 1.3 to 1.45 so something... 
```
Last login: Tue Jun 24 23:41:11 2025 from 10.1.0.5
eric@M70q:~$ adb shell

                                                         ▂▂▂▂▂▂▂▂▂▂▂▂▂          
                                                    ▂▄▆▆██▛▀▀▀▀▀▀▀▀▜████▆▆▄▂    
 ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗         ▗▆████▀▔             ▔▔▀▀▀▀▚▄  
 ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║       ▗▟████▀     ▗██▖    ▐█   ▝▀▆▄▄▄  
 ██╔████╔██║██║   ██║██║  ██║███████║██║      ▟████▀      ▗█▘▝█▖   ▐█       ▜█▀█
 ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║      █▌ ▐█▌     ▗█▘  ▝█▖  ▐█       ▐▄ ▄
 ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗  ▀████    ▗█▘    ▝█▖ ▐█     ▂▄███▀
 ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ▀▀██▄▄                ▂▆███▀   
                                                     ▀▀██▄▄ ▀▀▆▄▄▄▄▆██▀▀▀▘      


────────────────────────────────────────────────────────────────────────────────
system-image: 1.8.04-M0054-14.1a-perf
kernel:       #1 SMP PREEMPT Mon Mar 24 21:47:11 UTC 2025 4.19.125
────────────────────────────────────────────────────────────────────────────────
hw platform:  M0054
mach.var:     1.0.0
SKU:          MRB-D0006-4-V2-C11
────────────────────────────────────────────────────────────────────────────────
voxl-suite:   1.4.5
────────────────────────────────────────────────────────────────────────────────
current IP:   wlan0: 192.168.0.113
────────────────────────────────────────────────────────────────────────────────
```


reading this we finally get into the modem... so now have to figure out what the modem is or isn't doing. 
https://forum.modalai.com/topic/3738/monitor-sierra-wireless-5g-signal/3?lang=en-US
                                                                                         

```
OK
AT!IMAGE?
TYPE SLOT STATUS LRU FAILURES UNIQUE_ID   BUILD_ID
FW   1    GOOD   1   0 0      ?_?         02.13.08.00_?
FW   2    EMPTY  0   0 0                  
FW   3    EMPTY  0   0 0                  
Max FW images: 3
Active FW image is at slot 1

TYPE SLOT STATUS LRU FAILURES UNIQUE_ID   BUILD_ID
PRI  FF   GOOD   0   0 0      030.047_000 02.13.08.00_GENERIC
Max PRI images: 50
```
LOVE LOVE LOVE to see generic here. 
this means we can use test networks...hopefully.... 

# 20250627

ew... passwords:
https://forum.sierrawireless.com/t/em9191-at-password-not-working/27219

```
voxl2:/$ echo 1199 90e3 > /sys/bus/usb-serial/drivers/option1/new_id  
voxl2:/$ tio /dev/ttyUSB0
[tio 16:47:20] tio v1.29
[tio 16:47:20] Press ctrl-t q to quit
[tio 16:47:20] Connected
at
OK
aat
OK
at!usbcomp?
ERROR
at!entercnd="A710"
OK
at!usbcomp?
Config Index: 1
Config Type:  4 (MBIM V2)
Interface bitmask: 00001009 (diag,modem,mbim) 

OK
```

okay... so maybe this will fix things. 

so the Sierra wireless kinda assumes you know the "generic" at commands that apply to all sims...
Well I DONT, so thanks. these are commands that don't start with "AT!" SO...

Let's read this, at least there is documentation on the generic stuff here that we should be able to use. 
https://sixfab.com/wp-content/uploads/2018/09/Quectel_EC25EC21_AT_Commands_Manual_V1.2.pdf

```
AT+CIMI
001010123456789
```
OH?! This is good. The sim imsi is being read!
```
AT+CCID
+CCID: 8949440000001380813
```
this might be a problem because... 
```
AT!IMSIM?
!IMSIM: 

configuration: GENERIC_030.047_000, Firmware: 02.13.08.00, count: 6
  Type    Key    Rank    SubPri    Source
  IIN   89*****    0       0        PRI 
  IIN   89****     0       0        PRI 
  IIN   89***      0       0        PRI 
  IIN   89**       0       0        PRI 
  PLMN  ***:**     0       0        PRI 
  PLMN  ***:***    0       0        PRI 
```
^^^ Prob need to fix this. Or fix the CCID.  

<img width="2161" alt="image" src="https://github.com/user-attachments/assets/dbcbf318-0c6e-4f65-9724-9d3fd969e572" />

okay its attaching now... but not staying "on" need to investigate more. but getting closer! this is a big step. 

might be IMS?


#2025-07-05

lets look at the pcaps of the NGAP. ...
<img width="1448" alt="image" src="https://github.com/user-attachments/assets/63fbaa35-4348-403d-91e6-315add373d24" />

green is UL and red is DL. so the UEConectectRelease Request is on the UL. Therefore it is coming from the UE... the UE is unhappy about something and not trying to stay connected.... 

When this happens its looking for a service some way or another... 
sometimes this is IMS.. or the APN... or something similar. 

Its prob the APN... but might be IMS... IMS is usually something AFTER the initial APN is applied. 

for IMS... 
<img width="573" alt="image" src="https://github.com/user-attachments/assets/d1eb1bff-543c-4a89-9a26-2be2dfe05e8d" />

for APN
<img width="913" alt="image" src="https://github.com/user-attachments/assets/fc10949c-4392-4a06-a9b5-5d8a3e012d6f" />
```
OK
AT!GPSLBSAPN?
ERROR
at!entercnd="A710"
OK
AT!GPSLBSAPN?
Empty

OK
```
oh... empty APN... tisk tisk tisk... rookie over here... 

```AT!GPSLBSAPN=?
!GPSLBSAPN: <operation>[,<ratmask>[,<IP Type>,<APN>]]
<operation>: 1 - Add, all parameters must be present
             2 - Delete, only <rat> is required
             3 - Delete All, no other parameters required
<ratmask>: 0x01 - CDMA
           0x02 - HDR
           0x04 - GSM
           0x08 - WCDMA
           0x10 - LTE
<IP Type>: IPV4, IPV6, IPV4V6
<APN>: Quoted APN String

OK
AT!GPSLBSAPN=1,0x10,IPV4,internet
ERROR
at!entercnd="A710"
OK
AT!GPSLBSAPN=1,0x10,IPV4,internet
ERROR
AT!GPSLBSAPN=1,0x10,"IPV4","internet"
OK
AT!GPSLBSAPN?
 0x10,   IPV4, "internet" 

OK
AT!GPSLBSAPN=?
!GPSLBSAPN: <operation>[,<ratmask>[,<IP Type>,<APN>]]
<operation>: 1 - Add, all parameters must be present
             2 - Delete, only <rat> is required
             3 - Delete All, no other parameters required
<ratmask>: 0x01 - CDMA
           0x02 - HDR
           0x04 - GSM
           0x08 - WCDMA
           0x10 - LTE
<IP Type>: IPV4, IPV6, IPV4V6
<APN>: Quoted APN String

OK
AT!GPSLBSAPN=1,0x10,IPV4,internet
ERROR
at!entercnd="A710"
OK
AT!GPSLBSAPN=1,0x10,IPV4,internet
ERROR
AT!GPSLBSAPN=1,0x10,"IPV4","internet"
OK
AT!GPSLBSAPN?
 0x10,   IPV4, "internet" 

OKAT!GPSLBSAPN=?
!GPSLBSAPN: <operation>[,<ratmask>[,<IP Type>,<APN>]]
<operation>: 1 - Add, all parameters must be present
             2 - Delete, only <rat> is required
             3 - Delete All, no other parameters required
<ratmask>: 0x01 - CDMA
           0x02 - HDR
           0x04 - GSM
           0x08 - WCDMA
           0x10 - LTE
<IP Type>: IPV4, IPV6, IPV4V6
<APN>: Quoted APN String

OK
AT!GPSLBSAPN=1,0x10,IPV4,internet
ERROR
at!entercnd="A710"
OK
AT!GPSLBSAPN=1,0x10,"IPV4","internet"
OK
AT!GPSLBSAPN?
 0x10,   IPV4, "internet" 

OK
```
hmmm promising...hopefully 0x10 LTE is the same for NR. 
<img width="980" alt="image" src="https://github.com/user-attachments/assets/9842d50a-9cf7-4ff3-8cc4-8e5138cdbb5e" />

BAH!
<img width="880" alt="image" src="https://github.com/user-attachments/assets/f22c6628-6ea7-4a4a-9448-f763940e0dcd" />

GAH! `APN=srsRAN`?! ugh.. 

<img width="251" alt="image" src="https://github.com/user-attachments/assets/e92567d9-31df-4586-a7a3-e625513d5036" />

`APN=internet` ??

check if it was the IPV4 vs IPV4V6 that in the open5gs webgui
```
AT!GPSLBSAPN=3
OK
AT!GPSLBSAPN=?
!GPSLBSAPN: <operation>[,<ratmask>[,<IP Type>,<APN>]]
<operation>: 1 - Add, all parameters must be present
             2 - Delete, only <rat> is required
             3 - Delete All, no other parameters required
<ratmask>: 0x01 - CDMA
           0x02 - HDR
           0x04 - GSM
           0x08 - WCDMA
           0x10 - LTE
<IP Type>: IPV4, IPV6, IPV4V6
<APN>: Quoted APN String

OK
AT!GPSLBSAPN=1,0x10,"IPV4V6","internet"
OK
AT!GPSLBSAPN?
 0x10, IPV4V6, "internet" 

OK
```

`=3` deletes all the APNs..

<img width="879" alt="image" src="https://github.com/user-attachments/assets/0643ef0b-7c11-4276-913d-81cb5b510918" />

![image](https://github.com/user-attachments/assets/94c28eac-52c2-4a40-99fe-d7c5855d028a)

... 
<img width="619" alt="image" src="https://github.com/user-attachments/assets/025e4171-1552-42c1-a18f-4115d639d897" />
??
```
at+cgdcont?
+CGDCONT: 1,"IPV4V6","","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0
+CGDCONT: 2,"IPV4V6","ims","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0

OK
```
so... the APN isn't set? ya that GPS thing is weird... 

so more "generic" apn commands. 
```
AT+CGDCONT=1,"IPV4V6","internet"
OK
at+cgdcont?
+CGDCONT: 1,"IPV4V6","internet","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0
+CGDCONT: 2,"IPV4V6","ims","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0

OK
```
<img width="857" alt="image" src="https://github.com/user-attachments/assets/c474068c-5870-4dad-88b0-5899ce293018" />

... -__-

back to this:
https://sixfab.com/wp-content/uploads/2018/09/Quectel_EC25EC21_AT_Commands_Manual_V1.2.pdf

what is `AT+CGATT`?

<img width="812" alt="image" src="https://github.com/user-attachments/assets/76707045-27cf-4eb5-b866-3cb0d1fd5254" />

```
OK
AT+CGATT=1
OK
AT+CGATT=0
OK
AT+CGATT=1
OK
```
<img width="977" alt="image" src="https://github.com/user-attachments/assets/eda52ca7-f545-4f5f-be8a-22da563955c2" />


that made it RACH again? okay... 
something....

<img width="1005" alt="image" src="https://github.com/user-attachments/assets/30e871dc-520c-4c58-afdf-5960bcce2303" />

was this it the whole time?
so how do we make the PDU session?


wait what? 
<img width="1024" alt="image" src="https://github.com/user-attachments/assets/82693e0c-6232-4633-8966-5cc28322245d" />

... idk what I did!?

???
<img width="668" alt="image" src="https://github.com/user-attachments/assets/5f4bfcf4-b2d6-44b7-b76b-c8c1d70eaa6f" />

```
at
OK
AT+CGDCONT?
+CGDCONT: 1,"IPV4V6","internet","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0
+CGDCONT: 2,"IPV4V6","ims","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0

OK
AT+CGACT=1,1
+CME ERROR: unknown
AT+CGPADDR=1
+CGPADDR: 1,"0.0.0.0","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0"

OK
AT+CGDCONT=1,"IP","internet"
OK
AT+CGACT=1,1
+CME ERROR: unknown
AT+CGREG?
+CGREG: 0,0

OK
AT+CGATT=1
OK
AT+CGREG?
+CGREG: 0,0

OK
AT+CGEREP?
+CGEREP: 0,0

OK
AT+CMGL=?
+CMGL: (0-4)

OK
AT+CGDATA=?
+CGDATA: ("PPP")

OK
AT+CGDCONT?
+CGDCONT: 1,"IP","internet","0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0
+CGDCONT: 2,"IPV4V6","ims","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0",0,0,0,0,,,,,,,,,"",,,,0

OK
AT+CGREG?
+CGREG: 0,0

OK
```
???

but I can't ping... 
hmmm
so something is happening or needed time... 
its still attached, but there isn't an ip address 10.45.0.5 ?
which is the SIM card. 

so the packets here are the UL measurements reports I had setup.. its keeping the UE attached I think?
<img width="820" alt="image" src="https://github.com/user-attachments/assets/68a3b98a-0eb4-4671-82d0-599c29a3762a" />

at least there is a SRB (Signaling Radio Bearer) being used. 

now to fix the DRB (Data Radio Bearer)
                                                                                                                                                                                                                                                                                                    
```

OK
AT+CGPADDR=1
+CGPADDR: 1,"0.0.0.0"

OK
AT+CGACT=1,1
OK
AT+CGPADDR=1
+CGPADDR: 1,"10.45.0.5"

OK
```
<img width="1619" alt="image" src="https://github.com/user-attachments/assets/47760f76-ce05-423b-b211-938c274361dc" />

AND BOOM WE GOT A PING!!?!?!?!


HUZZAHHHH!

okay so the ping stayed up for a while... 

lets reboot and see what happens... 

it came back... but didn't start the pings... 
<img width="858" alt="image" src="https://github.com/user-attachments/assets/7acbb4da-fb28-47c4-8ab4-d578ad78477e" />

```
AT+CGACT=1,1
OK
```
<img width="1579" alt="image" src="https://github.com/user-attachments/assets/0070bdf9-af2d-4725-9ad7-1a5637ebe702" />
THAT bring its back!
okay!


```
root@M70q:~# cat /home/eric/srsRAN_Project/configs/00101__gnb_rf_b200_tdd_n78_20mhz.yml 
# This example configuration outlines how to configure the srsRAN Project gNB to create a single TDD cell
# transmitting in band 78, with 20 MHz bandwidth and 30 kHz sub-carrier-spacing. A USRP B200 is configured
# as the RF frontend using split 8. Note in this example an external clock source is not used, so the sync
# is not defined and the default is used

# Autodetected card type: sysmoISIM-SJA5
# Generated card parameters :
#  > Name     : Magic
#  > SMSP     : e1ffffffffffffffffffffffff0581005155f5ffffffffffff000000
#  > ICCID    : 8949440000001380805
#  > MCC/MNC  : 001/01
#  > IMSI     : 001010000138080
#  > Ki       : 4d56753bfd400a9560e7ccd4debca476
#  > OPC      : 072bf504aaba377cbce5ecbde06f6b0a
#  > ACC      : None
#  > ADM1(hex): 3638313436363634
#  > OPMODE   : None
# Programming ...
gnb_id: 411
gnb_id_bit_length: 32
cu_cp:
  amf:
    addr: 127.0.0.5
    port: 38412
    bind_addr: 127.0.0.5
    supported_tracking_areas:
      - tac: 1
        plmn_list:
          - plmn: "00101"
            tai_slice_support_list:
              - sst: 1
  mobility:
    trigger_handover_from_measurements: true                    # Set the CU-CP to trigger handover when neighbor cell measurements arrive
    cells:                                                      # List of cells available for handover known to the cu-cp
      - nr_cell_id: 0x19B0                                        # Cell ID for cell 1
        periodic_report_cfg_id: 1                                 # Set the periodic report configuration ID for this cell
        ncells:                                                   # Neighbor cell(s) available for handover
          - nr_cell_id: 0x19B1                                      # Cell ID of neighbor cell available for handover
            report_configs: [ 2 ]                                   # Report configurations to configure for this neighbor cell
      - nr_cell_id: 0x19B1                                        # Cell ID for cell 2
        periodic_report_cfg_id: 1                                 # Set the periodic report configuration ID for this cell
        ncells:                                                   # Neighbor cell(s) available for handover
          - nr_cell_id: 0x19B0                                      # Cell ID of neighbor cell available for handover
            report_configs: [ 2 ]                                   # Report configurations to configure for this neighbor cell
    report_configs:                                             # Sets the report configuration for triggering handover
      - report_cfg_id: 1                                          # Report config ID 1
        report_type: periodical                                   # Sets the report type as periodical
        report_interval_ms: 480                                  # Optional UINT (1024). The report interval in ms. Supported: [120, 240, 480, 640, 1024, 2048, 5120, 10240, 20480, 40960, 60000, 360000, 720000, 1800000]. 
      - report_cfg_id: 2                                          # Report config ID 2
        report_type: event_triggered                              # Sets the report type as event triggered
        event_triggered_report_type: a3                           # Sets the event triggered report type as A3
        meas_trigger_quantity: rsrp                               # Sets the measurement trigger quantity as rsrp
        meas_trigger_quantity_offset_db: 3                        # Sets the measurement trigger quantity offset to 3dB
        hysteresis_db: 0                                          # Sets the hysteresis to 0dB
        time_to_trigger_ms: 100                                   # Sets the time to trigger to 100ms

# cells:
#   -
#     pci: 1
#     prach:
#       prach_root_sequence_index: 0
#   -
#     pci: 2
#     prach:
#       prach_root_sequence_index: 64        
      
ru_sdr:
  device_driver: uhd
  device_args: type=b200,serial=315AF4C,num_recv_frames=64,num_send_frames=64
  srate: 23.04
  otw_format: sc12
  tx_gain: 75 #75
  rx_gain: 60
  clock: external
  # sync: external
  # time_alignment_calibration: 0

cell_cfg:
  # dl_arfcn: 632628 #3489.42MHz
  # dl_arfcn: 623484 #3352.26MHz
  # dl_arfcn: 156000 #780.5MHz
  dl_arfcn: 627340  #B78 3410.1MHz
  band: 78
  channel_bandwidth_MHz: 20
  common_scs: 30
  plmn: "00101"
  tac: 1
  pci: 1

  pucch:
    p0_nominal: -84

  ssb:
    # ssb_period: 10                          # Optional UINT (10). Sets the period of SSB scheduling in milliseconds. Supported: [5, 10, 20].
    ssb_block_power_dbm: -25 #-25

  pdsch:
    # min_ue_mcs: 0                           # Optional UINT (0). Sets a minimum PDSCH MCS value to be used for all UEs. Supported: [0 - 28].
    # max_ue_mcs: 28                          # Optional UINT (28). Sets a maximum PDSCH MCS value to be used for all UEs. Supported: [0 - 28].
    # fixed_rar_mcs: 0                        # Optional UINT (0). Sets a fixed RAR MCS value for all UEs. Supported: [0 - 28].
    # fixed_sib1_mcs: 5                       # Optional UINT (5). Sets a fixed SIB1 MCS for all UEs. Supported: [0 - 28].
    # nof_harqs: 16                           # Optional UNIT (16). Sets the number of Downlink HARQ processes. Supported [2, 4, 6, 8, 10, 12, 16].
    # max_nof_harq_retxs: 4                   # Optional UINT (4). Sets the maximum number times a DL HARQ can be retransmitted before it is discarded. Supported: [0 - 4].
    # max_consecutive_kos: 100                # Optional UINT (100). Sets the maximum number of consecutive HARQ-ACK KOs before an RLF is reported. Supported: [0 - inf].
    # rv_sequence: [0,2,3,1]                  # Optional UINT (0,2,3,1). Sets the redundancy version sequence to use for PDSCH. Supported: any combination of [0, 1, 2, 3].
    # mcs_table: qam64                        # Optional TEXT (qam64). Sets the MCS table to use for PDSCH. Supported: [qam64, qam256].
    # min_rb_size: 1                          # Optional UINT (1). Sets the minimum RB size for the UE PDSCH resource allocation. Supported: [1 - 275].
    # max_rb_size: 275                        # Optional UINT (275). Sets the maximum RB size for the UE PDSCH resource allocation. Supported: [1 - 275].
    # start_rb: 0                             # Optional UINT (0). Sets the start RB for resource allocation of UE PDSCHs. Supported [0 - 275].
    # end_rb: 275                             # Optional UINT (275). Sets the end RB for resource allocation of UE PDSCHs. Supported [0 - 275].
    # max_pdschs_per_slot: 35                 # Optional UINT (35). Sets the maximum number of PDSCH grants per slot, including SIB, RAR, Paging and UE data grants. Supported: [1 - 35].
    # max_alloc_attempts: 35                  # Optional UINT (35). Sets the maximum number of DL or UL PDCCH grant allocation attempts per slot before scheduler skips the slot. Supported: [1 - 35].
    # olla_cqi_inc_step: 0.001                # Optional FLOAT (0.001). Sets the outer-loop link adaptation (OLLA) increment value. The value 0 means that OLLA is disabled. Supported: [0 - 1].
    olla_target_bler: 0.10                # Optional FLOAT (0.01). Sets the target DL BLER set in Outer-loop link adaptation (OLLA) algorithm. Supported: [0 - 0.5].
    # olla_max_cqi_offset: 4                  # Optional FLOAT (4). Sets the maximum offset that the Outer-loop link adaptation (OLLA) can apply to CQI. Supported: positive float.
    # dc_offset:                              # Optional TEXT. Sets the direct Current (DC) Offset in number of subcarriers, using the common SCS as reference for carrier spacing, and the center of the gNB DL carrier as DC offset value 0. The user can additionally
    #                                         # set "outside" to define that the DC offset falls outside the DL carrier or "undetermined" in the case the DC offset is unknown. Supported: [-1650 - 1649] OR [outside,undetermined,center].
    # harq_la_cqi_drop_threshold: 3           # Optional UINT (3). Sets the link Adaptation (LA) threshold for drop in CQI of the first HARQ transmission above which HARQ retransmissions are cancelled. Set this value to 0 to disable this feature. Supported: [0 - 15].
    # harq_la_ri_drop_threshold: 1            # Optional UINT (1). Sets the link Adaptation (LA) threshold for drop in nof. layers of the first HARQ transmission above which HARQ retransmission is cancelled. Set this value to 0 to disable this feature. Supported: [0 - 4].
    # dmrs_additional_position: 2             # Optional UINT (2). Sets the PDSCH DMRS additional position. Supported: [0 - 3].

log:
  # none, error, warning, info, debug
  filename: /tmp/gnb.log
  tracing_filename: /tmp/tracing.log
  all_level: info
  all_level: warning                    # Optional TEXT (warning). Sets a common log level across PHY, MAC, RLC, PDCP, RRC, SDAP, NGAP and GTPU layers.
  lib_level: warning                    # Optional TEXT (warning). Sets the generic log level.
  e2ap_level: warning                   # Optional TEXT (warning). Sets the E2AP log level.
  config_level: info                    # Optional TEXT (none). Sets the config log level.
  rrc_level: debug                    # Optional TEXT (warning). Sets the RRC log level.
  ngap_level: info                   # Optional TEXT (warning). Sets NGAP log level.
  sec_level: warning                    # Optional TEXT (warning). Sets the security functions level.
  pdcp_level: warning                   # Optional TEXT (warning). Sets the PDCP log level.
  sdap_level: warning                   # Optional TEXT (warning). Sets the SDAP log level.
  # e1ap_level: warning                   # Optional TEXT (warning). Sets the E1AP log level.
  # e1ap_json_enabled: false              # Optional BOOLEAN (false). Enables the JSON logging of E1AP PDUs. Supported: [false, true].
  cu_level: warning                     # Optional TEXT (warning). Sets the CU log level.
  mac_level: warning                    # Optional TEXT (warning). Sets the MAC log level.
  rlc_level: warning                    # Optional TEXT (warning). Sets the RLC log level.
  f1ap_level: info                   # Optional TEXT (warning). Sets the F1AP log level.
  f1u_level: warning                    # Optional TEXT (warning). Sets the F1u log level.
  gtpu_level: warning                   # Optional TEXT (warning). Sets the GTPU log level.
  du_level: warning                     # Optional TEXT (warning). Sets the DU log level.
  f1ap_json_enabled: false              # Optional BOOLEAN (false). Enables the JSON logging of F1AP PDUs. Supported: [false, true].
  # high_latency_diagnostics_enabled: false # Optional BOOLEAN (false). Enables logging of performance diagnostics when high computational latencies are detected. Supported: [false, true].
  fapi_level: warning                   # Optional TEXT (warning). Sets FAPI log level.
  hal_level: warning                    # Optional TEXT (warning). Sets the HAL log level.
  broadcast_enabled: false              # Optional BOOLEAN (false). Enables logging in the PHY and MAC layer of broadcast messages and all PRACH opportunities. Supported: [false, true].
  # phy_rx_symbols_filename:              # Optional TEXT. Print received symbols to file. Symbols will be printed if a valid path is set. Format: file path. This file can be used in the srsRAN_matlab project.
  # phy_rx_symbols_port: 0                # Optional TEXT. Set to a valid receive port number to dump the IQ symbols from that port only, or set to "all" to dump the IQ symbols from all UL receive ports. Only works if "phy_rx_symbols_filename" is set. Supported: [NON-NEGATIVE or all].
  # phy_rx_symbols_prach: false           # Optional BOOLEAN (false). Set to true to dump the IQ symbols from all the PRACH ports. Only works if "phy_rx_symbols_filename" is set. Supported: [false, true].
  # hex_max_size: 0                       # Optional UINT (0). Sets maximum number of bytes to print for hex messages. Supported: [0 - 1024]
  ofh_level: warning                    # Optional TEXT (warning). Sets Open Fronthaul log level.
  radio_level: info                     # Optional TEXT (info). Sets radio log level.
  phy_level: warning                    # Optional TEXT (warning). Sets PHY log level.

pcap:
  mac_enable: false
  mac_filename: /tmp/gnb_mac.pcap
  ngap_enable: false
  ngap_filename: /tmp/gnb_ngap.pcap
  f1ap_filename: /tmp/gnb_f1ap.pcap     # Optional TEXT (/tmp/gnb_f1ap.pcap). Path for F1AP PCAPs.
  f1ap_enable: false                    # Optional BOOLEAN (false). Enable/disable F1AP packet capture. Supported: [false, true].

metrics:
  autostart_stdout_metrics: true       # Optional BOOLEAN (false). Sets whether or note to autostart stdout metrics reporting. Supported [false, true].
  # enable_json_metrics: false
  # enable_log_metrics: true
```
<img width="903" alt="image" src="https://github.com/user-attachments/assets/2c810dbf-4d6e-4f98-ac8f-bcbdd9061d46" />

K = `465B5CE8 B199B49F AA5F0A2E E238A6BC`
OPC = `E8ED289D EBA952E4 283B54E8 8E6183CA`
imsi = `at+cimi > 001010123456789`
                                      

# Standing UP iperf3

<img width="830" alt="image" src="https://github.com/user-attachments/assets/6222c901-c886-4721-9f18-a105c2f025c7" />


so ya... need to get the 10.45.0.5  address to the Voxl controller..... so there is that... 
so I guess we're pinging the modem here and not the modem "controller" per say. 

# 2025-07-06

Okay still need to figure out how to pass the ip address `10.45.0.5` from the modem to the hardware device such that we can get iperf3 to start working... 

some fun at commands I wanted to try: 
```
at+CGPADDR 
+CGPADDR: 1,"10.45.0.5"
+CGPADDR: 2,"0.0.0.0","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0"

OK
at!NRINFO?
!NRINFO: 
Connectivity Mode: SA

NR5G Cell ID:    19B0 (6576)
NR5G band:       n78       		NR5G Carrier ID: 0
NR5G dl bw:      20 MHz    		NR5G ul bw:      20 MHz    
NR5G Tx Power:   19.0        		NR5G Tx chan:    627340
NR5G Rx chan:    627340
NR5G dl MIMO:    4         		NR5G ul MIMO:    1
NR5G(sub6) Rx0 RSSI (dBm):   -81.6	NR5G(sub6) Rx1 RSSI (dBm):   -93.4
NR5G(sub6) Rx2 RSSI (dBm):   -95.8	NR5G(sub6) Rx3 RSSI (dBm):   -94.1

NR5G RSRP (dBm): -110			NR5G RSRQ (dB):  -11
NR5G SINR (dB):  12.0


OK
```      

hmmm
so reading the `voxl-modem-start` it is using some QMI library:
reading this:
https://techship.com/support/faq/how-to-step-by-step-set-up-a-data-connection-over-qmi-interface-using-qmicli-and-in-kernel-driver-qmi-wwan-in-linux/

```
voxl2:/$ lsusb
Bus 002 Device 003: ID 1199:90e3 Sierra Wireless, Inc.  <<<<<<<< our Modem #Bus 2 dev 3
Bus 002 Device 002: ID 0424:5744 Standard Microsystems Corp. 
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 004: ID 0424:2740 Standard Microsystems Corp. 
Bus 001 Device 003: ID 0bda:0811 Realtek Semiconductor Corp. 
Bus 001 Device 002: ID 0424:2744 Standard Microsystems Corp. 
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
voxl2:/$ lsusb -t
/:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=xhci-hcd/1p, 10000M
    |__ Port 1: Dev 2, If 0, Class=Hub, Driver=hub/4p, 5000M
        |__ Port 1: Dev 3, If 0, Class=Communications, Driver=cdc_mbim, 5000M <<<our modem Bus 2 dev 3 is cdc_mbim??? not qmi like it should be 
        |__ Port 1: Dev 3, If 1, Class=CDC Data, Driver=cdc_mbim, 5000M
        |__ Port 1: Dev 3, If 3, Class=Vendor Specific Class, Driver=option, 5000M
        |__ Port 1: Dev 3, If 4, Class=Vendor Specific Class, Driver=option, 5000M
/:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=xhci-hcd/1p, 480M
    |__ Port 1: Dev 2, If 0, Class=Hub, Driver=hub/5p, 480M
        |__ Port 4: Dev 3, If 0, Class=Vendor Specific Class, Driver=rtl88XXau, 480M
        |__ Port 5: Dev 4, If 0, Class=Vendor Specific Class, Driver=, 480M
voxl2:/$ 

```     

maybe this is what we want to try ?
https://techship.com/support/faq/how-to-set-up-a-simple-data-connection-over-the-mbim-interface-using-libmbim-and-driver-cdc-mbim-in-linux/

... trouble connecting the wifi to get this going 
`voxel-wifi` seems connected to my local wifi??
...curious...


also now the modem isn't connecting??
maybe we should band lock it:
```
AT!BAND=5,1,"n78",4,0000000000000000,0000000000002000,0000000000000000,0000000000000000,0000000000000000
OK
at!band?
Index, Name
0C, NR5G ALL,
0 - GW:    0000000000000000
1 - LTE:   0000000000000000 0000000000000000
3 - NRNSA: 000081A03B0A38D7 0000000000007C62
4 - NRSA:  000081A03B0A38D7 0000000000007C62

OK
at!band=?
Index, Name
00, All bands
     0 - GW:    100200000EC00000
     1 - LTE:   0000A7E2BB0F38DF 0000000000000042
     3 - NRNSA: 000081A03B0A38D7 0000000000007C62
     4 - NRSA:  000081A03B0A38D7 0000000000007C62
01, Europe 3G
     0 - GW:    0002000000400000
     1 - LTE:   0000000000000000 0000000000000000
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
02, North America 3G
     0 - GW:    0000000004800000
     1 - LTE:   0000000000000000 0000000000000000
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
05, n78                                            <<< OUR NEWLY CREATED BAND!
     0 - GW:    0000000000000000
     1 - LTE:   0000000000000000 0000000000000000
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000002000
06, Europe
     0 - GW:    0002000000400000
     1 - LTE:   00000000000800C5 0000000000000000
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
07, North America
     0 - GW:    0000000004800000
     1 - LTE:   000001000301385A 0000000000000042
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
08, WCDMA ALL
     0 - GW:    100200000EC00000
     1 - LTE:   0000000000000000 0000000000000000
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
09, LTE ALL
     0 - GW:    0000000000000000
     1 - LTE:   0000A7E2BB0F38DF 0000000000000042
     3 - NRNSA: 0000000000000000 0000000000000000
     4 - NRSA:  0000000000000000 0000000000000000
0C, NR5G ALL
     0 - GW:    0000000000000000
     1 - LTE:   0000000000000000 0000000000000000
     3 - NRNSA: 000081A03B0A38D7 0000000000007C62
     4 - NRSA:  000081A03B0A38D7 0000000000007C62

Available:
0 - GW:    
     1000000000000000 - B19 (850)
     0002000000000000 - B8  (900)
     0000000008000000 - B6  (800)
     0000000004000000 - B5  (850)
     0000000002000000 - B4 (1700)
     0000000000800000 - B2 (1900)
     0000000000400000 - B1 (2100)
1 - LTE:   
     1/0000800000000000 - B48    
     1/0000200000000000 - B46    
     1/0000040000000000 - B43    
     1/0000020000000000 - B42    
     1/0000010000000000 - B41    
     1/0000008000000000 - B40    
     1/0000004000000000 - B39    
     1/0000002000000000 - B38    
     1/0000000200000000 - B34    
     1/0000000080000000 - B32    
     1/0000000020000000 - B30    
     1/0000000010000000 - B29    
     1/0000000008000000 - B28    
     1/0000000002000000 - B26    
     1/0000000001000000 - B25    
     1/0000000000080000 - B20    
     1/0000000000040000 - B19    
     1/0000000000020000 - B18    
     1/0000000000010000 - B17    
     1/0000000000002000 - B14    
     1/0000000000001000 - B13    
     1/0000000000000800 - B12    
     1/0000000000000080 - B8     
     1/0000000000000040 - B7     
     1/0000000000000010 - B5     
     1/0000000000000008 - B4     
     1/0000000000000004 - B3     
     1/0000000000000002 - B2     
     1/0000000000000001 - B1     
     2/0000000000000040 - B71    
     2/0000000000000002 - B66    
3 - NRNSA: 
     1/0000800000000000 - n48    
     1/0000010000000000 - n41    
     1/0000008000000000 - n40    
     1/0000002000000000 - n38    
     1/0000000020000000 - n30    
     1/0000000010000000 - n29    
     1/0000000008000000 - n28    
     1/0000000002000000 - n26    
     1/0000000001000000 - n25    
     1/0000000000080000 - n20    
     1/0000000000020000 - n18    
     1/0000000000002000 - n14    
     1/0000000000001000 - n13    
     1/0000000000000800 - n12    
     1/0000000000000080 - n8     
     1/0000000000000040 - n7     
     1/0000000000000010 - n5     
     1/0000000000000004 - n3     
     1/0000000000000002 - n2     
     1/0000000000000001 - n1     
     2/0000000000004000 - n79    
     2/0000000000002000 - n78    
     2/0000000000001000 - n77    
     2/0000000000000800 - n76    
     2/0000000000000400 - n75    
     2/0000000000000040 - n71    
     2/0000000000000020 - n70    
     2/0000000000000002 - n66    
4 - NRSA:  
     1/0000800000000000 - n48    
     1/0000010000000000 - n41    
     1/0000008000000000 - n40    
     1/0000002000000000 - n38    
     1/0000000020000000 - n30    
     1/0000000010000000 - n29    
     1/0000000008000000 - n28    
     1/0000000002000000 - n26    
     1/0000000001000000 - n25    
     1/0000000000080000 - n20    
     1/0000000000020000 - n18    
     1/0000000000002000 - n14    
     1/0000000000001000 - n13    
     1/0000000000000800 - n12    
     1/0000000000000080 - n8     
     1/0000000000000040 - n7     
     1/0000000000000010 - n5     
     1/0000000000000004 - n3     
     1/0000000000000002 - n2     
     1/0000000000000001 - n1     
     2/0000000000004000 - n79    
     2/0000000000002000 - n78    
     2/0000000000001000 - n77    
     2/0000000000000800 - n76    
     2/0000000000000400 - n75    
     2/0000000000000040 - n71    
     2/0000000000000020 - n70    
     2/0000000000000002 - n66    

OK
at!band=5
OK


```

<img width="1248" alt="image" src="https://github.com/user-attachments/assets/91f3275f-cb03-4a8b-a3bb-a64fae5bd570" />

BOOM!
DATA w/ Iperf3

afterwards we get the modem to be happy just run
`voxl-modem-start`

```
voxl2:/$ voxl-modem-start 

qrb5165 based hardware detected...
wwan0 is up!
Sierra detected!

Starting qmi network...
[/dev/cdc-wdm0] Network started
	Packet data handle: '3799687072'
[/dev/cdc-wdm0] Client ID not released:
	Service: 'wds'
	    CID: '44'
Command executed successfully.
\Starting udhcpc...
udhcpc: started, v1.27.2
No resolv.conf for interface wwan0.udhcpc
udhcpc: sending discover
udhcpc: sending select for 10.45.0.5
udhcpc: lease of 10.45.0.5 obtained, lease time 7200
Too few arguments.
Too few arguments.
```

```
AT!GSTATUS?
!GSTATUS: 
Current Time:  2146		Temperature: 40
Thermal Mitigation Level: 0

Reset Counter: 1		Mode:        ONLINE         
System mode:   NR5G       	PS state:    Attached     
MM5G state:    Registered       Normal Service
RRC state:     RRC Connected   
IMS reg state: NOT REGISTERED  	IMS mode:    Test         
IMS Srv State: UNKNOWN SMS,UNKNOWN VoIP

NR5G TAC:        000001        		NR5G Cell ID:    19B0 (6576)
NR5G band:       n78       		NR5G Carrier ID: 0
NR5G dl bw:      20 MHz    		NR5G ul bw:      20 MHz    
NR5G Tx Power:   8.0        		NR5G Tx chan:    627340
NR5G Rx chan:    627340
NR5G dl MIMO:    4         		NR5G ul MIMO:    1
NR5G(sub6) Rx0 RSSI (dBm):   -82.1	NR5G(sub6) Rx1 RSSI (dBm):   -92.6
NR5G(sub6) Rx2 RSSI (dBm):   -95.4	NR5G(sub6) Rx3 RSSI (dBm):   -93.9

NR5G RSRP (dBm): -111			NR5G RSRQ (dB):  -11
NR5G SINR (dB):  12.0


OK
```


HUZZAH IPERF AGAIN!!
<img width="878" alt="image" src="https://github.com/user-attachments/assets/3664c9a4-23dd-4751-9775-f941a1d8e76a" />

<img width="613" alt="image" src="https://github.com/user-attachments/assets/395ab7ea-2cd4-494b-ada6-2da75e19c9f1" />
:) 
so how did I do it?
... modem manager actually.. I let it do the things instead... of my own AT commands. 

` systemctl enable NetworkManager` so it runs on boot

```
voxl2:/$ mmcli -m 0 --simple-connect='apn=internet,ip-type=ipv4'
successfully connected the modem
```
give it 30s or a min or so...

ping our gateway... `10.45.0.1`

```
voxl2:/$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: bond0: <NO-CARRIER,BROADCAST,MULTICAST,MASTER,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether b6:58:ca:0f:b0:12 brd ff:ff:ff:ff:ff:ff
3: dummy0: <BROADCAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default qlen 1000
    link/ether de:9e:7a:d5:92:22 brd ff:ff:ff:ff:ff:ff
    inet6 fe80::9199:28b2:eaa7:d587/64 scope link 
       valid_lft forever preferred_lft forever
4: ip_vti0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN group default qlen 1000
    link/ipip 0.0.0.0 brd 0.0.0.0
5: ip6_vti0@NONE: <NOARP> mtu 1364 qdisc noop state DOWN group default qlen 1000
    link/tunnel6 :: brd ::
6: sit0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN group default qlen 1000
    link/sit 0.0.0.0 brd 0.0.0.0
7: ip6tnl0@NONE: <NOARP> mtu 1452 qdisc noop state DOWN group default qlen 1000
    link/tunnel6 :: brd ::
8: wlan0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 2312 qdisc mq state DOWN group default qlen 1000
    link/ether 00:c0:ca:b5:ab:8c brd ff:ff:ff:ff:ff:ff
9: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether 62:c2:d2:e3:f2:04 brd ff:ff:ff:ff:ff:ff
    inet 10.45.0.5/30 brd 10.45.0.7 scope global wwan0
       valid_lft forever preferred_lft forever
    inet6 fe80::79b3:a773:b94:a224/64 scope link 
       valid_lft forever preferred_lft forever
voxl2:/$ ping 10.45.0.1
PING 10.45.0.1 (10.45.0.1): 56 data bytes
64 bytes from 10.45.0.1: icmp_seq=0 ttl=64 time=14.241 ms
64 bytes from 10.45.0.1: icmp_seq=1 ttl=64 time=53.881 ms
64 bytes from 10.45.0.1: icmp_seq=2 ttl=64 time=12.307 ms
64 bytes from 10.45.0.1: icmp_seq=3 ttl=64 time=10.909 ms
64 bytes from 10.45.0.1: icmp_seq=4 ttl=64 time=10.644 ms
64 bytes from 10.45.0.1: icmp_seq=5 ttl=64 time=29.774 ms
64 bytes from 10.45.0.1: icmp_seq=6 ttl=64 time=29.462 ms
64 bytes from 10.45.0.1: icmp_seq=7 ttl=64 time=28.050 ms
64 bytes from 10.45.0.1: icmp_seq=8 ttl=64 time=26.741 ms
64 bytes from 10.45.0.1: icmp_seq=9 ttl=64 time=25.746 ms
```

```
iperf3 -s
```

and on the gNB

```
 iperf3 -p 5201 -c 10.45.0.5 -b 50M -t 0
```


power cycle a few times and verify the test works?!

1. Cell Up
2. Power up the drone
3. attach USB-C
4. `ADB Shell`
5. `mmcli -m 0` << to verify the modem is seen. Also takes about 30s for it to kick in. 
6. `mmcli -m 0 --simple-connect='apn=internet,ip-type=ipv4'`
8. `ip route add default dev wwan0 metric 200`
8. `watch ping 10.45.0.1`
9. `route` ??
10. NA << we setup iperf3 to run as a service on boot all the time. `iperf3 -s` 
11. `exit`
12. `iperf3 -p 5201 -c 10.45.0.5 -b 50M -t 0`
13. unplug usb-c
14. iperf3 still going?
15. go fly around. 

steps 5,6, and 8 as script ./modemStartup.sh
```bash
#!/bin/bash

# Define the command to check modem status
MODEM_CHECK_COMMAND="mmcli -m 0"

# Define the error message we're looking for
ERROR_MESSAGE="error: couldn't find modem at '/org/freedesktop/ModemManager1/Modem/0'"

# Define the commands to run after modem is found
CONNECT_COMMAND="mmcli -m 0 --simple-connect='apn=internet,ip-type=ipv4'"
ADD_ROUTE_COMMAND="ip route add default dev wwan0 metric 200"

# Ping target and duration
PING_TARGET="10.45.0.1"
PING_DURATION_SECONDS=100 # Total duration to keep trying pings

echo "Waiting for modem to be detected..."

# Loop until the modem is found
while true; do
    MODEM_OUTPUT=$(eval "$MODEM_CHECK_COMMAND" 2>&1) # Redirect stderr to stdout
    if echo "$MODEM_OUTPUT" | grep -q "$ERROR_MESSAGE"; then
        echo "Modem not found. Waiting 2 second and trying again..."
        sleep 2
    else
        echo "Modem detected!"
        echo "$MODEM_OUTPUT"
        break # Exit the loop once modem is detected
    fi
done

echo "Attempting to connect to the modem and set up routing..."

# Run the connection command
echo "Running: $CONNECT_COMMAND"
eval "$CONNECT_COMMAND"
if [ $? -eq 0 ]; then
    echo "Modem connection command executed successfully."
    sleep 2
else
    echo "Error: Modem connection command failed."
    exit 1
fi

# Run the add route command
echo "Running: $ADD_ROUTE_COMMAND"
eval "$ADD_ROUTE_COMMAND"
if [ $? -eq 0 ]; then
    echo "Route added successfully."
    sleep 2
else
    echo "Error: Failed to add route."
    # Depending on your needs, you might want to exit here or continue
    # if the routing error is not critical for your application.
    exit 1
fi

# Verify with a ping, trying for PING_DURATION_SECONDS
echo "Verifying connectivity with ping to $PING_TARGET for up to ${PING_DURATION_SECONDS} seconds..."

PING_SUCCESS=false
END_TIME=$(( SECONDS + PING_DURATION_SECONDS ))

while [ $SECONDS -lt $END_TIME ]; do
    echo "Attempting ping to $PING_TARGET..."
    # Ping with a single packet (-c 1) and a timeout (-W 1)
    ping -c 1 -W 1 "$PING_TARGET" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Ping successful! Connectivity confirmed."
        PING_SUCCESS=true
        break # Exit the ping loop
    else
        echo "Ping failed. Retrying in 1 second..."
        sleep 1
    fi
done

if [ "$PING_SUCCESS" = true ]; then
    echo "Script completed successfully."
else
    echo "Error: Ping to $PING_TARGET failed after ${PING_DURATION_SECONDS} seconds. Check network configuration."
    exit 1
fi
```                                                                                                        