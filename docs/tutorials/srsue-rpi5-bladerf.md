** As of 2024-12-03 I have not gotten the bladeRF to work on a PI5. Running into FW issues and devices not being recognized. The required deviations from the vanilla install are pointing me to try a PI that is Ubuntu 22.04 compatible. I have a pi3 at home, I will try that shortly. I also have a Lenovo t450 laptop that has worked fairly consistently.

Trying to get things to work on ubuntu 24 is like jamming a round peg into a square hole, it might work, but you will be scouring forums and running into fringe issues that aren't 100% hashed out like the Ubuntu 22 version that is more openly supported. For the sake of progress I am re-writing this as of (01-2025) for ubuntu 22. 

# Setup:
![Test Setup](http://www.plantuml.com/plantuml/png/1S793K8n30N0Lg00uZi5K03B-Sj97YIIiyWBjC_CkSyYKH4gf-Q-xKga_4kVxYro6BIiwPYUoXeqk1JXV3775zFe6RwqinWftaODN8q6zqbPkE9-Eruu7l3OQSUGFm00)


# 1. Setting up the PI (PI5 !=  PI4)
Check which version of ubuntu you have installed. For my PI I installed ubuntu 24.04. (Ubuntu 22.04 isn't supported for the PI5. 👎 )
the differences are outlined in [THIS THREAD](https://github.com/srsran/srsRAN_4G/issues/1339). I'll add the install steps below. 
If you are using a pi 4 it is recommended to install ubuntu 22.04 instead and follow the tutorial outlined on their website. 
```bash
pi@pi-desktop:~$ lsb_release -a
Distributor ID:	Ubuntu
Description:	Ubuntu 24.04.1 LTS
Release:	24.04
Codename:	noble
```
Afterwards make sure things are up to date. 
```bash
apt update
apt upgrade 
```

# 2. instal BladeRF Software
install things from this repo
[https://github.com/Nuand/bladeRF](https://github.com/Nuand/bladeRF)

`git clone https://github.com/Nuand/bladeRF.git`
download FPGA images from their website. 
one-liner working as of Dec-2024
```bash
cd ./bladeRF;
mkdir ./bladeRF_fpga_fw_images;
cd ./bladeRF_fpga_images;
wget https://www.nuand.com/fpga/hostedxA4-latest.rbf;
wget https://www.nuand.com/fpga/hostedxA5-latest.rbf;
wget https://www.nuand.com/fpga/hostedxA9-latest.rbf;
wget https://www.nuand.com/fpga/hostedx40-latest.rbf;
wget https://www.nuand.com/fpga/hostedx115-latest.rbf;
echo "downloading fw_image"
wget https://www.nuand.com/fx3/bladeRF_fw_latest.img;
ls -lha;
```

`cd ./bladeRF/host/`

had to run away from the defaults a bit here:
```
#install These first
sudo apt install libusb-1.0-0-dev;
sudo apt-get install libncurses5-dev;

#then build
mkdir -p build
cd build
#run a different make line because libusb errors on make in ubuntu 24. I think for Ubuntu 22 that regular cmake is fine if you fix the lib curses and libusb dependencies install. 
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -DINSTALL_UDEV_RULES=ON -DENABLE_BACKEND_LIBUSB=TRUE ../
make
sudo make install
sudo ldconfig
```

as a note this section takes a while, its not broken or hung just be patient!! I sure wasn't... it takes 5+ mins... 
``` 
-- Found Git: /usr/bin/git (found version "2.43.0") 
Submodule 'thirdparty/analogdevicesinc/no-OS' (https://github.com/analogdevicesinc/no-OS/) registered for path 'thirdparty/analogdevicesinc/no-OS'
Cloning into '/home/pi/bladeRF/thirdparty/analogdevicesinc/no-OS'...
``` 

if things went well you should be able to identify your device now!
```bash
pi@pi-desktop:~/bladeRF/host/build$ sudo bladeRF-cli -p

  Description:    Nuand bladeRF 2.0
  Backend:        libusb
  Serial:         cd4246b37ba340e49c510bbea6e80f1b
  USB Bus:        5
  USB Address:    2
```
Note* The bladeRF doesn't like it when the PI reboots. I've noticed that I need to reset the usb connection manually if the PI is rebooted. If there is no device detected run the command above to make sure it can be seen by the PI. 

# 3. install soapySDR
Note if you try to skip this srsRAN will not build srsUE. You won't be able to run srsUE from the command line. Best to follow these steps in order FYI. 
```bash
cd ~
git clone https://github.com/pothosware/SoapySDR.git
cd SoapySDR
git checkout tags/soapy-sdr-0.7.2
mkdir build && cd build
cmake ..
make -j4
sudo make install
sudo ldconfig
```


# 4. Install srsRAN_4G
[srsRAN_4G Installation](https://docs.srsran.com/projects/4g/en/latest/general/source/1_installation.html)
we're going to build from source and for the technically unsupported ubuntu 24.04 version. srsRAN_4G is meant for ubuntu 22.04. We are using ubuntu 24 due to ubuntu 22 is unsupported for the PI5. If you are using a pi4 that has ubuntu 22 support that is recommended. 
```bash
cd ~
sudo apt-get install build-essential cmake libfftw3-dev libmbedtls-dev libboost-program-options-dev libconfig++-dev libsctp-dev
sudo apt install gcc-11 g++-11

...
git clone https://github.com/srsRAN/srsRAN_4G.git
cd srsRAN_4G
#git checkout tags/release_19_12
mkdir build && cd build

export CC=$(which gcc-11)
export CXX=$(which g++-11)
cmake ../ -B build
cmake --build build -j$(nproc)

cmake ../
make
#make test
sudo make install
sudo ldconfig
sudo ./srsran_install_configs.sh user
```
you _should_ be able to run `sudo srsue` just note that it will throw errors because we haven't configured the config file for bladeRF just yet. 

```bash
eric@T450:~/srsRAN_4G/build$ srsue
Active RF plugins: libsrsran_rf_blade.so libsrsran_rf_zmq.so
Inactive RF plugins: 
Couldn't open , trying /home/eric/.config/srsran/ue.conf
Reading configuration file /home/eric/.config/srsran/ue.conf...
WARNING: cpu0 scaling governor is not set to performance mode. Realtime processing could be compromised. Consider setting it to performance mode before running the application.

Built in Release mode using commit ec29b0c1f on branch master.

Opening 1 channels in RF device=default with args=default
Supported RF device list: bladeRF zmq file
Trying to open RF device 'bladeRF'
Opening bladeRF...
Set RX sampling rate 1.92 Mhz, filter BW: 1.92 Mhz
RF device 'bladeRF' successfully opened
Warning: Failed to create thread with real-time priority. Creating it with normal priority: Operation not permitted
Waiting PHY to initialize ... Warning: Failed to create thread with real-time priority. Creating it with normal priority: Operation not permitted
Warning: Failed to create thread with real-time priority. Creating it with normal priority: Operation not permitted
Warning: Failed to create thread with real-time priority. Creating it with normal priority: Operation not permitted
Warning: Failed to create thread with real-time priority. Creating it with normal priority: Operation not permitted
done!
Attaching UE...
Set RX sampling rate 1.92 Mhz, filter BW: 1.92 Mhz
set RX frequency to 2680000000
set TX frequency to 2560000000
.......RF status: O=4, U=0, L=0
.......
..............................
........................
```

# 5. Finding a spot to Tx:

based off this discussion: https://github.com/srsran/srsRAN_Project/discussions/785
there are only a few bands that are supported by srsRAN. It is initially confusing if you refer to other websites like this one: https://www.sqimway.com/nr_band.php Which would lead you to believe the n78 would support 15KHz scs. However there is a difference between the SSB and the SCS. In some cases the SSB and the SCS can be different. IN n78 the SSB is always 30KHz, and even though the common SCS is 15, this is slightly different. In fact tryin got operate 15KHz SCS in n78 is only QASI 15Khz, because the SSB always needs to be 30KHz. Therefore for simplicity the folowing table from 38.101 is supported by srsRAN, and we should pick 15KHz bands from this table instead. 

<img width="761" alt="image" src="https://github.com/user-attachments/assets/b2a85d58-a9e3-4c64-9561-bfb6f52bf1d8" />

reference https://www.etsi.org/deliver/etsi_ts/138100_138199/13810101/17.05.00_60/ts_13810101v170500p.pdf



# 6. Configure srsUE based on gNB settings:
from [THIS](https://docs.srsran.com/projects/4g/en/latest/app_notes/source/5g_sa_amari/source/index.html) guide. 
A big point to make about srsUE is the limitations for 15KHz SCS (Sub-Carrier Spacing)
* Limited to 15 kHz Sub-Carrier Spacing (SCS), which means only FDD bands can be used.
* Limited to 5, 10, 15 or 20 MHz Bandwidth (BW)

With this in mind we will need to be strategic for which bands we decide to use. I recommend using GQRX as a spectrum analyzer and try to find a piece of the spectrum that isn't being heavily used. 

gNB Settings:
```yaml
eric@M70q:~/srsRAN_Project/configs$ cat ./15KHz_00101_b200_n78_20mhz.yml 
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

ru_sdr:
  device_driver: uhd
  device_args: type=b200,num_recv_frames=64,num_send_frames=64
  srate: 23.04
  otw_format: sc12
  tx_gain: 80
  rx_gain: 50
  clock: external
  sync: external
  # time_alignment_calibration: 0

cell_cfg:
  # dl_arfcn: 632628 #3489.42MHz
  # dl_arfcn: 623484 #3352.26MHz
  # dl_arfcn: 156000 #780.5MHz
  dl_arfcn: 627340    
  band: 78
  channel_bandwidth_MHz: 20
  common_scs: 15
  plmn: "00101"
  tac: 1
  pci: 1

  pucch:
    p0_nominal: -84  

  ssb:
    # ssb_period: 10                          # Optional UINT (10). Sets the period of SSB scheduling in milliseconds. Supported: [5, 10, 20].
    ssb_block_power_dbm: -25 

log:
  filename: /tmp/gnb.log
  all_level: info
  # mac_level: debug

pcap:
  mac_enable: false
  mac_filename: /tmp/gnb_mac.pcap
  ngap_enable: false
  ngap_filename: /tmp/gnb_ngap.pcap

metrics:
  autostart_stdout_metrics: true       # Optional BOOLEAN (false). Sets whether or note to autostart stdout metrics reporting. Supported [false, true].
```

# References:
[build guide for RaspberryPI](https://docs.srsran.com/projects/4g/en/latest/app_notes/source/pi4/source/index.html)

[5G SA Guide for srsUE](https://docs.srsran.com/projects/4g/en/latest/app_notes/source/5g_sa_amari/source/index.html)

[PI models supported for Ubuntu Releases](https://ubuntu.com/certified/iot?q=pi&limit=20&category=Ubuntu+Core&release=22.04+LTS)