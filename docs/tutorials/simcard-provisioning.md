This page is general notes I've done trying to program SIM cards. If anything this is an online repo instead of taking notes locally on paper. 

Main Reference: https://downloads.osmocom.org/docs/pysim/master/html/shell.html
SUCI Reference link: https://downloads.osmocom.org/docs/pysim/master/html/suci-tutorial.html
srsRAN Programming: https://docs.srsran.com/projects/project/en/latest/tutorials/source/cotsUE/source/index.html

```txt
For REFERENCE: 
IMSI	        ICCID	            ACC	    PIN1	PUK1	    PIN2	PUK2	    Ki	                                OPC	                                ADM1	    KIC1	                            KID1	                            KIK1                                KIC2                                KID2                                KIK2                                KIC3                                KID3                                KIK3
999700000138080	8949440000001380805	0001	0000	05646054	0000	84955009	D64FAF6FB65D7733954D8491B44D86DC	D8288D6515F40E6ADEF9E93A31A567C8	68146664	9CA8F6A11712D81D913EC71EC12C82A6	86E2404490BC733D01EFE6BBCABB313F	76958CE56F74DCFC92C167AB7312E33A	461F72390521B2DF35B9A0282C1D52D6	0C87A72C9F9C37120544B2CF55C7C9EE	0BAC74AB49F83955E3ADAFB5D3B4CF74	6E919EEC6AB79AA9E85F33C16EE2896D	EFB11C80A8A78C144D5249F2ED813E51	743D61C329DD835411CAC2E9C578E600
999700000138081	8949440000001380813	0002	0000	23426229	0000	47058918	6DA8BC6620E24C3181C644122EC86EDE	E4A24FD56C48CEABBB1CB9257199BE9F	36669058	E22BB57F5CFEB3F3CFE0EDE2623BC8AC	24D911AB042827BFE708A4D4C2E205D0	88DA6CA9B6C971AC0828EA4484B75B64	75BFC190FBB1C4BA04F6975459DF31EC	DB1C5987CE1FF55B6764A2DB3DE33A2F	AC405E032075D5D715B2A5C0321D5329	F7FD68685DD49556CA6628970EE97C21	BB67A718802ECB664782721C7A34284A	1179E33F7AD2D2D8AB0739BA4C3DC82C
```

```bash
cd pysim/
./pySim-read.py -p0
eric@M70q:~/pysim$ ./pySim-read.py -p0
Using reader PCSC[HID Global OMNIKEY 3x21 Smart Card Reader [OMNIKEY 3x21 Smart Card Reader] 00 00]
Reading ...
Autodetected card type: sysmoISIM-SJA5
ICCID: 8949440000001380813
IMSI: 999700000138081
GID1: ffffffffffffffffffff
GID2: ffffffffffffffffffff
SMSP: ffffffffffffffffffffffffffffffffffffffffffffffffe1ffffffffffffffffffffffff06815384090067ffffffffff000000
SPN: Not available
Show in HPLMN: False
Hide in OPLMN: False
PLMNsel: ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
PLMNwAcT:

#if this doesn't work try flipping around the SIM card and try again 
```

So from the details above we can see that these SIM cards are initially provision for PLMN 999-70. our gNB is using 001-01 so we will re-provision it accordingly:

we need to line up the ADMIN PIN, KI and OPC to match what is already on the card
```bash 
#we will edit this line from the srsRAN site:
./pySim-prog.py -p0 -s 8988211000000689615 --mcc=001 --mnc=01 -a 77190612 --imsi=001010123456789  -k 41B7157E3337F0ADD8DA89210D89E17F --opc=1CD638FC96E02EBD35AA0D41EB6F812F

#to this: note we only really need to change the plan of the IMSI such that it matches our local network: 001-01 I think even the -s is optional here:
./pySim-prog.py -p0 -s 8949440000001380813 --mcc=001 --mnc=01 -a 36669058 --imsi=001010123456789

eric@M70q:~/pysim$ ./pySim-read.py -p0
Using reader PCSC[HID Global OMNIKEY 3x21 Smart Card Reader [OMNIKEY 3x21 Smart Card Reader] 00 00]
Reading ...
Autodetected card type: sysmoISIM-SJA5
ICCID: 8949440000001380813
IMSI: 001010123456789
GID1: ffffffffffffffffffff
GID2: ffffffffffffffffffff
SMSP: ffffffffffffffffffffffffffffffffffffffffffffffffe1ffffffffffffffffffffffff0581005155f5ffffffffffff000000
SPN: Magic
Show in HPLMN: True
Hide in OPLMN: True
```

Add it to the OPen5GS

<img width="845" alt="image" src="https://github.com/user-attachments/assets/dcc3a580-127c-4a66-9cfc-a05f03b27b42" />

Also don't forget to add an ip address at the end! It makes your life easier in the figure: For this one I did 10.45.0.5. (Remember the OG Stun subnet is 10.45.0.1/24 )

A key important thing is to BE PATIENT!!! Sometimes it takes 10 mins for the UE to search and attach. (But really.. an actual 10 mins. ) 



