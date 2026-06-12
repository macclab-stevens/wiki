Assuming you have already UE attached to the network.  

## Making the UE a static ip address in our network:
Each time the UE registers the SMF (Session Management Function) assigns a new ip address. As you can see here from the logs:
```bash
eric@M70q:~$ sudo cat  /var/log/open5gs/smf.log | grep 00101
01/24 11:59:46.008: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.2] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:33:27.818: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.2] IPv6:[] (../src/smf/context.c:1691)
01/24 12:33:32.883: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.3] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:35:01.845: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.3] IPv6:[] (../src/smf/context.c:1691)
01/24 12:35:06.704: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.4] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:35:39.741: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.4] IPv6:[] (../src/smf/context.c:1691)
01/24 12:35:45.423: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.5] IPv6[] (../src/smf/npcf-handler.c:585)
``` 

It's fairly straight forward to edit this file in the open5GS system. Like we setup before we go to the open5GS gui. (I have it setup to host on port 8080, your milage may vary here depending on how you set it up. )
My IMSI/PLMN is on the 00101 network:

<img width="600" alt="image" src="https://github.com/user-attachments/assets/516f7c1a-19f5-474e-935b-05c1911d090d" />

the OGStun is the default route that is setup for open5GS. Anything on this subnet should be able to ping the UE. 
Example from the gNB/5GC host PC:

<img width="693" alt="image" src="https://github.com/user-attachments/assets/0bcf214c-dd9c-42c8-a658-7ba45c4495ef" />

OGStun is the open5GS route that is setup on the 5GC host. we can see this subnet through `ifconfig`

```bash
eric@M70q:~$ ifconfig
eno2: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.13  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2601:48:101:1c50:a34c:742b:1c40:f5a0  prefixlen 64  scopeid 0x0<global>
        inet6 fd6e:7647:e1eb:8f10:a50a:3c15:1a4e:3106  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::f179:315f:45c6:be1b  prefixlen 64  scopeid 0x20<link>
        inet6 2601:48:101:1c50:272b:c92c:2418:cb79  prefixlen 64  scopeid 0x0<global>
        inet6 fd6e:7647:e1eb:8f10:54:1c75:d0e1:2d7d  prefixlen 64  scopeid 0x0<global>
        inet6 2601:48:101:1c50::4e  prefixlen 128  scopeid 0x0<global>
        ether 6c:24:08:28:8f:48  txqueuelen 1000  (Ethernet)
        RX packets 2993338  bytes 1844269348 (1.8 GB)
        RX errors 0  dropped 716  overruns 0  frame 0
        TX packets 1396607  bytes 512267291 (512.2 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        device interrupt 16  memory 0xb1200000-b1220000  

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 11469655  bytes 1164216111 (1.1 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 11469655  bytes 1164216111 (1.1 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ogstun: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1400
        inet 10.45.0.1  netmask 255.255.0.0  destination 10.45.0.1
        inet6 fe80::2ccd:7f3b:8f64:6fb  prefixlen 64  scopeid 0x20<link>
        inet6 2001:db8:cafe::1  prefixlen 48  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)
        RX packets 3203  bytes 265856 (265.8 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 14383  bytes 876888 (876.8 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
To edit the ip address in open5GS we just pick a value inside the 10.45.0.X/24 subnet. I'll pick `10.45.0.2`

<img width="424" alt="image" src="https://github.com/user-attachments/assets/b2b9116b-7c4e-4705-9600-857af5b55874" />

To test airplane mode the UE a few times and check the `/var/log/smf.log` file to make sure the ip address is there:
```bash
eric@M70q:~$ sudo tail -f /var/log/open5gs/smf.log | grep 00101
01/24 12:46:06.969: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.2] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:46:09.289: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.2] IPv6:[] (../src/smf/context.c:1691)
01/24 12:46:22.074: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.2] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:46:23.489: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.2] IPv6:[] (../src/smf/context.c:1691)
01/24 12:46:28.593: [smf] INFO: UE SUPI[imsi-001010000138080] DNN[internet] IPv4[10.45.0.2] IPv6[] (../src/smf/npcf-handler.c:585)
01/24 12:46:30.970: [smf] INFO: Removed Session: UE IMSI:[imsi-001010000138080] DNN:[internet:5] IPv4:[10.45.0.2] IPv6:[] (../src/smf/context.c:1691)
```
You should also be able to ping this address also, and we can test the Connectivity when we airplane mode the UE. 
```bash
eric@M70q:~$ ping 10.45.0.2
PING 10.45.0.2 (10.45.0.2) 56(84) bytes of data.
64 bytes from 10.45.0.2: icmp_seq=1 ttl=64 time=109 ms
64 bytes from 10.45.0.2: icmp_seq=2 ttl=64 time=87.9 ms
64 bytes from 10.45.0.2: icmp_seq=3 ttl=64 time=16.9 ms
```

## APKs
### Termux:
I used [THIS](https://github.com/termux/termux-app/releases/download/v0.118.1/termux-app_v0.118.1+github-debug_arm64-v8a.apk) version. 
### iperf3
My pixel 7 is arm based so we download [THIS](https://github.com/davidBar-On/android-iperf3/blob/gh-pages/libs/arm64-v8a/iperf3.18) version. 

## ADB Shell via USB
start by making sure you can get into the device. You will likely need to set permissions first time like below:
```bash
eric@home % adb devices
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
28101FDH300E25	unauthorized
# At this point I "Authorized This Device" (e.g. my MAC) on the Pixel 7. 
eric@home % adb shell
cheetah:/ $   #<<< From this line we can see we are in the UE now! <3 
```

## Install termux
go to the folder where the apk is:
`adb install ./termux-app_v0.118.1+github-debug_arm64-v8a.apk'

## install iperf3
This is more weird. But I found it better than the other APK because this is "pure iperf3". 
Download the binary for arm and you push it to /data/local/tmp/
```bash
adb push <LOCAL_PATH_TO_BINARY_FILE>/<BINARY_NAME> /data/local/tmp/<BINARY_NAME>
adb shell chmod 777 /data/local/tmp/<BINARY_NAME>
```

test that it works
```bash
% adb shell /data/local/tmp/iperf3.18 -h
Usage: iperf3 [-s|-c host] [options]
       iperf3 [-h|--help] [-v|--version]

Server or Client:
  -p, --port      #         server port to listen on/connect to
  -f, --format   [kmgtKMGT] format to report: Kbits, Mbits, Gbits, Tbits
  -i, --interval  #         seconds between periodic throughput reports
  -I, --pidfile file        write PID file
```

## install iperf3
`apt install iperf3`

## run iperf3.18 on the UE as a server.
Setup terms such that you have file permissions and stuff
https://wiki.termux.com/wiki/Termux-setup-storage
inside termux on the UE:
cd HOME
cp /data/local/tmp/iperf3.18 .
# test
./iperf3.18 -h

### Setup iperf3 as a server:
inside terms
```bash
cd home
./iperf3.18 -s
-----------------------------------------------------------
Server listening on 5201
-----------------------------------------------------------
``` 

## Test it out
on the 5GC side run:
```bash
eric@M70q:~$ iperf3 -p 5201 -c 10.45.0.2 
Connecting to host 10.45.0.2, port 5201
[  5] local 10.45.0.1 port 53056 connected to 10.45.0.2 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  1.63 MBytes  13.7 Mbits/sec    0    101 KBytes       
[  5]   1.00-2.00   sec  1.60 MBytes  13.5 Mbits/sec    0    176 KBytes       
[  5]   2.00-3.00   sec  1.91 MBytes  16.0 Mbits/sec    0    263 KBytes       
[  5]   3.00-4.00   sec  2.28 MBytes  19.2 Mbits/sec    0    361 KBytes       
[  5]   4.00-5.00   sec  1.42 MBytes  11.9 Mbits/sec    0    428 KBytes       
[  5]   5.00-6.00   sec  2.28 MBytes  19.2 Mbits/sec    0    552 KBytes       
[  5]   6.00-7.00   sec  4.38 MBytes  36.8 Mbits/sec    0    741 KBytes       
[  5]   7.00-8.00   sec  3.70 MBytes  31.1 Mbits/sec    0    904 KBytes       
[  5]   8.00-9.00   sec  4.57 MBytes  38.3 Mbits/sec    0   1.06 MBytes       
[  5]   9.00-10.00  sec  3.75 MBytes  31.5 Mbits/sec    0   1.26 MBytes       
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  27.5 MBytes  23.1 Mbits/sec    0             sender
[  5]   0.00-10.28  sec  25.9 MBytes  21.1 Mbits/sec                  receiver

iperf Done.
```

To customize and run specific data rate test refer to the main website:
https://iperf.fr/iperf-doc.php


#Example:
So my setup is 20MHz off a b200. The b200 has some pretty bad bunny ear antennas. However about 10-15m away from the device I get the following:
<img width="808" alt="image" src="https://github.com/user-attachments/assets/68ead24e-b996-4d01-abde-ea1d3b18aeb3" />
```bash
eric@M70q:~$ iperf3 -p 5201 -c 10.45.0.2 -b 50M
Connecting to host 10.45.0.2, port 5201
[  5] local 10.45.0.1 port 50810 connected to 10.45.0.2 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  1.31 MBytes  11.0 Mbits/sec    0   89.5 KBytes       
[  5]   1.00-2.00   sec  2.12 MBytes  17.8 Mbits/sec    0    188 KBytes       
[  5]   2.00-3.00   sec  2.50 MBytes  21.0 Mbits/sec    0    307 KBytes       
[  5]   3.00-4.00   sec  2.25 MBytes  18.9 Mbits/sec    0    411 KBytes       
[  5]   4.00-5.00   sec  2.50 MBytes  21.0 Mbits/sec    0    528 KBytes       
[  5]   5.00-6.00   sec  2.62 MBytes  22.0 Mbits/sec    0    654 KBytes       
[  5]   6.00-7.00   sec  3.38 MBytes  28.3 Mbits/sec    0    811 KBytes       
[  5]   7.00-8.00   sec  3.62 MBytes  30.4 Mbits/sec    0    975 KBytes       
[  5]   8.00-9.00   sec  3.38 MBytes  28.3 Mbits/sec    0   1.11 MBytes       
[  5]   9.00-10.00  sec  3.00 MBytes  25.2 Mbits/sec    0   1.26 MBytes       
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  26.7 MBytes  22.4 Mbits/sec    0             sender
[  5]   0.00-10.39  sec  25.8 MBytes  20.8 Mbits/sec                  receiver
```
