the Telit FN990A28 is a M.2 based 5G modem that can interface with a raspberry pi. 

# References:

M.2 Pi HAT: https://www.waveshare.com/wiki/PCIe_TO_4G/5G_M.2_USB3.2_HAT+#FAQ

Telit FN990A28 Modem: https://www.telit.com/devices/fn990axx/

<img width="1621" alt="image" src="https://github.com/user-attachments/assets/10b05b9e-a45d-411a-8b9a-80633cf58dfe" />

and from Open-Cells:
```bash
Telit FN990A28

M.2	all	41, 78	001/01	OAI/develop	open5GS	
open cells

work well with ModemManager. AT commands are not needed for establishing PDU sessions
```

modem manager: https://ubuntu.com/core/docs/modemmanager/gathering-modem-information

Another Modem manager How TO: https://techship.com/support/faq/how-to-guide-control-and-set-up-a-data-connection-in-linux-using-modemmanager-as-connection-manager/


***

# Setup 

Power via USB-C to Computer. (You can bypass the HAT -> PI All together if you want. 
Wait about 1 min for the Modem to boot
Check that the modem is recognized on you linux machine:
```bash
eric@M70q:~$ lsusb
Bus 002 Device 004: ID 2500:0020 Ettus Research LLC USRP B210
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 013: ID 1dd2:2443 Leo Bodnar Electronics Ltd LBE-1420 GPS Locked Clock Source
Bus 001 Device 017: ID 1bc7:1070 Telit Wireless Solutions FN990         #<<<<< THIS GUY RIGHT HERE
Bus 001 Device 006: ID 8087:0aaa Intel Corp. Bluetooth 9460/9560 Jefferson Peak (JfP)
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```


## Setting Up Serial

Not sure why but running as sudo is required for either method.

With Minicom:

<img width="314" alt="image" src="https://github.com/user-attachments/assets/30439c28-bd1e-4b3c-b190-df058740dbda" />

```bash
sudo minicom -D /dev/ttyUSB2
```

With Tio
```bash
eric@M70q:~$ sudo tio /dev/ttyUSB2
[tio 09:53:19] tio v1.32
[tio 09:53:19] Press ctrl-t q to quit
[tio 09:53:19] Connected
at
OK
```

## AT Commands

I don't think CAPITOL commands matter. e.g. `AT` is interpreted the same as `at`

* When no display text of what you are typing. Blindly put in: `ATE1#` and you should be able to `AT` -> `OK` again. 
* Repeat Last command: `a/`
* Read IMSI: `at+cimi` , if no sim is detect returns error: `+CME ERROR: 10`
* Query Sim: `at#qss?` returns `#QSS: 0,0,1` 
* Cell Survey: `at#csurv` Takes a second or two to search everything

## Modem Manager

`sudo apt install modemmanager`

```bash
eric@M70q:~$ mmcli -L
    /org/freedesktop/ModemManager1/Modem/7 [Telit] FN990A28
```
The sim here is in 7 so... 
```bash
eric@M70q:~$ mmcli -m 7
  -----------------------------
  General  |              path: /org/freedesktop/ModemManager1/Modem/7
           |         device id: e2ba8a4d1fbb9ef05a702bd862431f1a04203dd3
  -----------------------------
  Hardware |      manufacturer: Telit
           |             model: FN990A28
           | firmware revision: M0R.000002
           |    carrier config: default
           |      h/w revision: 1.00
           |         supported: gsm-umts, lte, 5gnr
           |           current: gsm-umts, lte, 5gnr
           |      equipment id: 359918921163028
  -----------------------------
  Status   |             state: failed
           |     failed reason: sim-missing
           |       power state: on
  -----------------------------
```
The SIM card slot isn't being read... hmmm...


set `SIMINCFG` to read SIM card as `HIGH` like srsRAN says in their notes: (Page ~522 in AT command guide)

From 4.5.17 AT#SIMINCFG - SIMIN Pin Configuration
```bash
AT#SIMINCFG=1,1
OK
AT#SIMINCFG=2,1
OK
AT#REBOOT
```

SIM card being read now:
```bash
eric@M70q:~$ mmcli -m 10
  ----------------------------------
  General  |                   path: /org/freedesktop/ModemManager1/Modem/10
           |              device id: e2ba8a4d1fbb9ef05a702bd862431f1a04203dd3
  ----------------------------------
  Hardware |           manufacturer: Telit
           |                  model: FN990A28
           |      firmware revision: M0R.000002
           |         carrier config: default
           |           h/w revision: 1.00
           |              supported: gsm-umts, lte, 5gnr
           |                current: gsm-umts, lte, 5gnr
           |           equipment id: 359918921163028
  ----------------------------------
  Status   |                   lock: sim-pin2
           |         unlock retries: sim-pin (3), sim-puk (10), sim-pin2 (3), sim-puk2 (10)
           |                  state: enabled
           |            power state: on
           |         signal quality: 0% (recent)
  ----------------------------------
```

## Band Configuration 4.2.16 AT#BND - Select Band

So my UE is still not attaching to my B78 Cell. Perhaps the band configuration is not set:

```bash
at#bnd?
#BND: 0,22,A7E2BB0F38DF,42,1A0290800D7,7042,81A0290800D7,7442
#<GSM_band>,<UMTS_band>,    <LTE_band>,<LTE_band_ext>,<NSA_NR5G_band_1_64>,<NSA_NR5G_band_65_128>,<SA_NR5G_band_1_64>,<SA_NR5G_band_65_128>      
#         0,         22,  A7E2BB0F38DF,            42,         1A0290800D7,                  7042,       81A0290800D7,          7442
```

The band confirmation and allocation is certainly confusing as the `SA_NR5G_band_1_64` is `7442` which is based on this:
<img width="563" alt="image" src="https://github.com/user-attachments/assets/6749c641-1762-47b9-aadb-befd0bac519f" />
 
So base on this 7000 = 1000 (n77) + 2000(n78) + 4000(n79) , so our band should be selected and "find able". Perhaps the cell selection just takes a long time here. 

also apparently FW versions matter:

<img width="596" alt="image" src="https://github.com/user-attachments/assets/2b233070-aaa1-4149-8301-8e9466416526" />
```bash
at#getfw

HOST FIRMWARE  : A0R.000021
SLOT   STATUS     CARRIER  VERSION         TMCFG
1      Activated  Generic  M0R.000002      2071        

OK
```
like the looks of "Generic" for carrier. 


there are a lot of rules:

<img width="599" alt="image" src="https://github.com/user-attachments/assets/1998f912-59f3-4332-bc4a-9ccb46582c8d" />

## Lets control the 5G bands first: AT#5GCTL - Control the 5G bands

```bash
at#5gctl?
#5GCTL: 2
```

<img width="542" alt="image" src="https://github.com/user-attachments/assets/58c6009a-def3-4c34-adff-ad5daee7467c" />

So I suppose we are doing the right thing. We want SA 5G FR1. So this is correct to be in mode 2. 

Lets try to set the band to be just n78 and reboot the modem:

```bash
at#bnd=0,0,1,0,0,0,0,2000
OK
at#reboot
OK
# wait a bit for the modem to reboot. 
at#bnd?
#BND: 0,0,1,0,0,0,0,2000
```

OH?
We got SOME ACTIVITY!!!

<img width="807" alt="image" src="https://github.com/user-attachments/assets/8359ac1a-36b8-4a82-ad5d-83a56d32b307" />

and the AMF log:
```bash
02/16 12:18:41.752: [amf] INFO: InitialUEMessage (../src/amf/ngap-handler.c:435)
02/16 12:18:41.752: [amf] INFO: [Added] Number of gNB-UEs is now 1 (../src/amf/context.c:2698)
02/16 12:18:41.752: [amf] INFO:     RAN_UE_NGAP_ID[0] AMF_UE_NGAP_ID[4] TAC[1] CellID[0x66c000] (../src/amf/ngap-handler.c:596)
02/16 12:18:41.752: [amf] INFO: [suci-0-001-01-0-0-0-0123456789] known UE by SUCI (../src/amf/context.c:1863)
02/16 12:18:41.752: [gmm] INFO: Registration request (../src/amf/gmm-sm.c:1224)
02/16 12:18:41.752: [gmm] INFO: [suci-0-001-01-0-0-0-0123456789]    SUCI (../src/amf/gmm-handler.c:174)
02/16 12:18:41.755: [sbi] WARNING: [AUSF] (SCP-discover) NF has already been added [49353378-e761-41ef-9b70-0b901bc3b1d3] (../lib/sbi/path.c:217)
02/16 12:18:41.755: [sbi] WARNING: [49353378-e761-41ef-9b70-0b901bc3b1d3] NF Instance updated [type:AUSF validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.755: [sbi] INFO: [49353378-e761-41ef-9b70-0b901bc3b1d3] NF Instance setup [type:AUSF validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.755: [amf] WARNING: NF EndPoint(addr) updated [127.0.0.11:7777] (../src/amf/nausf-handler.c:130)
02/16 12:18:41.755: [amf] INFO: NF EndPoint(addr) setup [127.0.0.11:7777] (../src/amf/nausf-handler.c:130)
02/16 12:18:41.834: [sbi] WARNING: [UDM] (SCP-discover) NF has already been added [493580ee-e761-41ef-b96f-9d1d317607db] (../lib/sbi/path.c:217)
02/16 12:18:41.834: [sbi] WARNING: [493580ee-e761-41ef-b96f-9d1d317607db] NF Instance updated [type:UDM validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.834: [sbi] INFO: [493580ee-e761-41ef-b96f-9d1d317607db] NF Instance setup [type:UDM validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.835: [sbi] WARNING: [UDM] (SCP-discover) NF has already been added [493580ee-e761-41ef-b96f-9d1d317607db] (../lib/sbi/path.c:217)
02/16 12:18:41.835: [sbi] WARNING: [493580ee-e761-41ef-b96f-9d1d317607db] NF Instance updated [type:UDM validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.835: [sbi] INFO: [493580ee-e761-41ef-b96f-9d1d317607db] NF Instance setup [type:UDM validity:0s] (../lib/sbi/path.c:227)
02/16 12:18:41.837: [amf] WARNING: NF EndPoint(addr) updated [127.0.0.13:7777] (../src/amf/nudm-handler.c:355)
02/16 12:18:41.837: [amf] INFO: NF EndPoint(addr) setup [127.0.0.12:7777] (../src/amf/nudm-handler.c:355)
02/16 12:18:41.839: [amf] WARNING: NF EndPoint(addr) updated [127.0.0.12:7777] (../src/amf/npcf-handler.c:143)
02/16 12:18:41.839: [amf] INFO: NF EndPoint(addr) setup [127.0.0.13:7777] (../src/amf/npcf-handler.c:143)
02/16 12:18:42.028: [gmm] INFO: [imsi-001010123456789] Registration complete (../src/amf/gmm-sm.c:2411)
02/16 12:18:42.028: [amf] INFO: [imsi-001010123456789] Configuration update command (../src/amf/nas-path.c:607)
02/16 12:18:42.028: [gmm] INFO:     UTC [2025-02-16T17:18:42] Timezone[0]/DST[0] (../src/amf/gmm-build.c:551)
02/16 12:18:42.028: [gmm] INFO:     LOCAL [2025-02-16T12:18:42] Timezone[-18000]/DST[0] (../src/amf/gmm-build.c:556)
02/16 12:18:44.788: [amf] INFO: UE Context Release [Action:2] (../src/amf/ngap-handler.c:1731)
02/16 12:18:44.788: [amf] INFO:     RAN_UE_NGAP_ID[0] AMF_UE_NGAP_ID[4] (../src/amf/ngap-handler.c:1732)
02/16 12:18:44.788: [amf] INFO:     SUCI[suci-0-001-01-0-0-0-0123456789] (../src/amf/ngap-handler.c:1736)
02/16 12:18:44.788: [amf] INFO: [Removed] Number of gNB-UEs is now 0 (../src/amf/context.c:2705)
```

and in modem manager:
```bash
eric@M70q:~$ mmcli -L
    /org/freedesktop/ModemManager1/Modem/13 [Telit] FN990A28
eric@M70q:~$ mmcli -m 13
  ----------------------------------
  General  |                   path: /org/freedesktop/ModemManager1/Modem/13
           |              device id: e2ba8a4d1fbb9ef05a702bd862431f1a04203dd3
  ----------------------------------
  Hardware |           manufacturer: Telit
           |                  model: FN990A28
           |      firmware revision: M0R.000002
           |         carrier config: default
           |           h/w revision: 1.00
           |              supported: gsm-umts, lte, 5gnr
           |                current: gsm-umts, lte, 5gnr
           |           equipment id: 359918921163028
  ----------------------------------
  Status   |                   lock: sim-pin2
           |         unlock retries: sim-pin (3), sim-puk (10), sim-pin2 (3), sim-puk2 (10)
           |                  state: registered
           |            power state: on
           |            access tech: 5gnr
           |         signal quality: 50% (recent)
```

we are "REGISTERED!"

## Establishing a connection manually

open5GS Settings:

<img width="754" alt="image" src="https://github.com/user-attachments/assets/dafedfa9-7b6b-40f7-b377-5c6178da81de" />

```bash
eric@M70q:~$ mmcli -L
    /org/freedesktop/ModemManager1/Modem/15 [Telit] FN990A28
eric@M70q:~$ sudo mmcli -m 15 --simple-connect='apn=internet,ip-type=ipv4v6'
successfully connected the modem
```

<img width="824" alt="image" src="https://github.com/user-attachments/assets/a8a18586-5e50-404d-95ad-73baa489a25d" />


## IP address things:

```bash
eric@M70q:~$ mmcli -m 15
  ----------------------------------
  Bearer   |                  paths: /org/freedesktop/ModemManager1/Bearer/2


eric@M70q:~$ sudo mmcli -m 15 -b 2
  ------------------------------------
  General            |           path: /org/freedesktop/ModemManager1/Bearer/2
                     |           type: default
  ------------------------------------
  Status             |      connected: yes
                     |      suspended: no
                     |    multiplexed: no
                     |      interface: wwan0
                     |     ip timeout: 20
  ------------------------------------
  Properties         |            apn: internet
                     |        roaming: allowed
                     |        ip type: ipv4v6
  ------------------------------------
  IPv4 configuration |         method: static
                     |        address: 10.45.0.5
                     |         prefix: 30
                     |        gateway: 10.45.0.6
                     |            dns: 8.8.8.8, 8.8.4.4
                     |            mtu: 1400
  ------------------------------------
  Statistics         |     start date: 2025-02-16T17:41:42Z
                     |       duration: 570
                     |       bytes rx: 420
                     |       attempts: 1
                     | total-duration: 570
                     | total-bytes rx: 420
```

But still can't ping.... hmmm.....


# Enable ADB AT#ENADB - Enable/disable ADB Interfaces
`AT#ENADB=1`

you should be able to see the modem in devices:
```bash
eric@M70q:~$ adb devices
List of devices attached
17ebc604	no permissions (user in plugdev group; are your udev rules wrong?); see [http://developer.android.com/tools/device.html]
```
looks like there is something here to fix... 

found this: 
https://atoma.spb.ru/sites/default/files/documents/telit_appzone_linux_user_guide.pdf

<img width="741" alt="image" src="https://github.com/user-attachments/assets/64059a8c-e101-4e4f-80d0-e88264a73e1e" />

```bash
eric@M70q:~$ adb kill-server
eric@M70q:~$ adb root
* daemon not running; starting now at tcp:5037
* daemon started successfully
adbd is already running as root
eric@M70q:~$ adb devices
List of devices attached
17ebc604	device

eric@M70q:~$ adb shell

sdxlemur login: 
```

this seemed to do the trick

appears you can't log in.. but this is a meant for the Telit IoT Zone. where using their app you can make android applications that run and show the outputs to the user. So for now you can't actually get into the ads part of the phone and run apps, but you might be able to run them from here. 


# Hardware Notes:

The FN990A series uses a MHF4 adapter for the RF connections, this is different than u.FL see this picture:
<img width="1215" alt="image" src="https://github.com/user-attachments/assets/8e97027c-ab67-4586-b5e8-a285f9b91133" />


