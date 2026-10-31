
![Puku CLI](https://poridhi.io/Puku-logo.svg)

[](https://poridhi.io/)

**59 min**

## NETWORK NAMESPACE INSPECTING

**Shrink**

## Linux Network Stack

![network-stack](https://lab-bucket.s3.brilliant.com.bd/labthumbnail/482ee565-aff7-4853-90de-13401024239f.png)

In Linux networking, within the Linux network stack, routes define traffic paths, iptables configures packet filtering, lo is a local loopback interface for testing, and eth0 is the primary Ethernet interface for external connections. Let's inspect the network stack, in short.

Network interfaces allow us to establish communication between a network and a device.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">ip</span><span></span><span class="token">link</span><span> list</span></code></div></pre>

`lo` is the loopback interface, allowing local network communication within a device without external network involvement. Verify the loopback interface is up

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">ifconfig</span><span> lo</span></code></div></pre>

A `route` in networking specifies the path for network traffic from source to destination. View the routing table:

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">ip</span><span> route show</span></code></div></pre>

`iptables` is a user-space utility for configuring packet filter rules in the Linux kernel's Netfilter framework. View `iptables` rules:

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span>iptables -L</span></code></div></pre>

## Create Custom Network Namespace

Let's create a custom namespace using `ip netns add` utiliy.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">sudo</span><span></span><span class="token">ip</span><span> netns </span><span class="token">add</span><span> poridhi
</span><span></span><span class="token">sudo</span><span></span><span class="token">ip</span><span> netns list</span></code></div></pre>

Now, entering a network namespace in Linux:

`ip netns exec`

It is part of the iproute2 package and is often used for managing network namespaces.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">sudo</span><span></span><span class="token">ip</span><span> netns </span><span class="token class-name">exec</span><span> poridhi </span><span class="token">bash</span></code></div></pre>

`nsenter`

The `nsenter` utility is commonly used to enter into namespaces in Linux, including network namespaces.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">sudo</span><span> nsenter --net</span><span class="token">=</span><span>/var/run/netns/poridhi </span><span class="token">bash</span></code></div></pre>

Now, check the network interfaces inside the new ns.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">ip</span><span></span><span class="token">link</span><span> show</span></code></div></pre>

Let's check for `iptable` rules for custom ns.

<pre class="!mb-3 relative"><div class="absolute right-2.5 top-2.5 text-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 opacity-90 rounded text-white bg-gray-50/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></div><div><code class="language-bash"><span class="token">ifconfig</span><span> lo</span></code></div></pre>



----------------

Puku CLI


59 min


CONNECT NETWORK NS TO HOST

Shrink
Connecting a container to host using virtual Ethernet cable
In root ns, it looks like

root-ns

Let's create a custom namespace using ip netns add utiliy.

sudo ip netns add red
sudo ip netns list
red-ns

From the root network namespace, let's create a veth cable:

sudo ip link add veth-red type veth peer name veth-host
We just created a pair of interconnected virtual Ethernet devices or interfaces, whatever we say. Both veth-red and veth-host lies inside the root ns.

ip link list
link-list

To connect the root namespace with the red namespace, we need to keep one end of the cable in the root namespace and move another one end into the red ns.

sudo ip link set veth-red netns red
This moves one end of the veth pair (veth-red) into the "red" namespace. The other end (veth-host) remains in the default network namespace.

Now, let's configure IP Addresses to both end of this veth cable and once we turn up the interfaces, the peer device will instantly display any packet that appears on one of the devices.

In the "red" namespace:

sudo ip netns exec red ip addr add 192.168.1.1/24 dev veth-red
sudo ip netns exec red ip link set veth-red up
red-interface

On the host side:

sudo ip addr add 192.168.1.2/24 dev veth-host
sudo ip link set veth-host up
root-interface

The virtual ethernet pair is now ready.

interfaces

A route is needed to add on the host to direct traffic destined for 192.168.1.1 through the veth-host interface.

sudo ip route add 192.168.1.1 dev veth-host
Why Add a Route?
Without adding the route, the system doesn't know how to reach 192.168.1.1. When we ping 192.168.1.1, the system checks its routing table to determine where to send the ping packets. If there's no specific route for 192.168.1.1, it won't know which interface to use.

By adding the route, we are explicitly telling the system that to reach 192.168.1.1, it should send the traffic through the veth-host interface, which is part of the veth pair connected to the "red" namespace.

Test connectivity
Let's try to ping the red ns from the veth-host interface:

ping 192.168.1.1 -c 3
host to ns ping

Again, let's try to ping the veth-host interface from the red namespace:

sudo ip netns exec red bash
ping 192.168.1.2 -c 3
ns to host ping


-----------

Puku CLI


59 min


CONNECT NETWORK NS TO ROOT

Shrink

Connecting a container network namespace to root network namespace
Let's create a custom network namespace ns0 and a bridge br0. In Linux networking, a bridge is a virtual network device that connects multiple network interfaces, allowing them to function as a single logical network.

sudo ip netns add ns0
sudo ip link add br0 type bridge
ns0-br0

Configure a bridge interface
A new device, the br0 bridge interface, has been created, but it's now in a DOWN state. Let's assign ip address and turn it into UP state.

sudo ip link set br0 up
sudo ip addr add 192.168.0.1/16 dev br0
br0 setup

Now let's verify whether br0 is able to receive the packet or not.

ping to br0

Configure virtual ethernet cable
It's time to set up a virtual Ethernet cable. One cable hand will be configured as a nic card in the ns0 namespace, while the other hand will be configured in the br0 interface.

sudo ip link add veth0 type veth peer name ceth0
sudo ip link set ceth0 netns ns0
sudo ip link set veth0 master br0
Both end of this cable is now in DOWN state. Let's turn into UP state

sudo ip netns exec ns0 ip link set ceth0 up
sudo ip link set veth0 up
Configure ns0 namespace
We need to assign an ip address to ceth0 and turn loopback interface into UP state.

sudo ip link set lo up
sudo ip addr add 192.168.0.2/16 dev ceth0
Namespace ns0 to root ns Communication
Let's check the Ip address assigned to primary ethernet interface of host machine.

ip addr show 
ens3

Now, ping to this ip address

sudo ip netns exec ns0 bash
ping 10.0.0.25
output

It says network in unreachable. So, something is not okay. Let's check the route table.

route
The output may look like.

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.0.0     0.0.0.0         255.255.0.0     U     0      0        0 ceth0
This routing table entry indicates that any destination IP address within the 192.168.0.0/16 network should be reached directly through the ceth0 interface, without the need for a specific gateway.

So we need to add a Default Gateway in the route table.

ip netns exec ns0 bash
ip route add default via 192.168.0.1
route added

Now we are good to go! Let's ping again.

sudo ip netns exec ns0 bash
ping 10.0.0.25 -c 5
ping-pong


--------


Puku CLI


59 min


EGRESS TRAFFIC

Shrink

Connecting a container network namespace to root network namespace
Let's create a custom network namespace ns0 and a bridge br0. In Linux networking, a bridge is a virtual network device that connects multiple network interfaces, allowing them to function as a single logical network.

sudo ip netns add ns0
sudo ip link add br0 type bridge
ns0-br0

Configure a bridge interface
A new device, the br0 bridge interface, has been created, but it's now in a DOWN state. Let's assign ip address and turn it into UP state.

sudo ip link set br0 up
sudo ip addr add 192.168.0.1/16 dev br0
br0 setup

Now let's verify whether br0 is able to receive the packet or not.

ping to br0

Configure virtual ethernet cable
It's time to set up a virtual Ethernet cable. One cable hand will be configured as a nic card in the ns0 namespace, while the other hand will be configured in the br0 interface.

sudo ip link add veth0 type veth peer name ceth0
sudo ip link set ceth0 netns ns0
sudo ip link set veth0 master br0
Both end of this cable is now in DOWN state. Let's turn into UP state

sudo ip netns exec ns0 ip link set ceth0 up
sudo ip link set veth0 up
Configure ns0 namespace
We need to assign an ip address to ceth0 and turn loopback interface into UP state.

sudo ip link set lo up
sudo ip addr add 192.168.0.2/16 dev ceth0
Namespace ns0 to root ns Communication
Let's check the Ip address assigned to primary ethernet interface of host machine.

ip addr show 
ens3

Now, ping to this ip address

sudo ip netns exec ns0 bash
ping 10.0.0.25
output

It says network in unreachable. So, something is not okay. Let's check the route table.

route
The output may look like.

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.0.0     0.0.0.0         255.255.0.0     U     0      0        0 ceth0
This routing table entry indicates that any destination IP address within the 192.168.0.0/16 network should be reached directly through the ceth0 interface, without the need for a specific gateway.

So we need to add a Default Gateway in the route table.

ip netns exec ns0 bash
ip route add default via 192.168.0.1
route added

Now we are good to go! Let's ping again.

sudo ip netns exec ns0 bash
ping 10.0.0.25 -c 5
ping-pong

Ping 8.8.8.8 from ns0 [ egress traffic ]
We have come so far. Now we can ping our root ns or primary ethernet interface from custom namesapce. But can we ping outside the world? Let's ping to 8.8.8.8.

sudo ip netns exec ns0 bash
ping 8.8.8.8 -c 5
Okay, it does not seem that the network is unreachable. It's something else. Maybe somewhere, packets have stuck. Let's dig it out. We can do it using the Linux utility tcpdump. We will check two interfaces. One is br0, and the other is ens3 (in the case of my device).  

stuck

Here we can see that packets are coming to those interfaces but are still stuck in ns0. But why?

Root Cause
See! The source IP address, 192.168.0.2, is attempting to connect to Google DNS 8.8.8.8 using its private IP address. So it's very basic that the outside world can't reach that private IP because they have no idea about that particular private IP address. That's why packets are able to reach Google DNS, but we are not getting any replies from 8.8.8.8.

Solution
We must somehow change the private IP address to a public address in order to sort out this issue with the help of NAT (Network Translation Address). So, a SNAT (source NAT) rule must be added to the IP table in order to modify the POSTROUTING chain.

sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/16  -j MASQUERADE
Role of POSTROUTING
The POSTROUTING chain in iptables is part of the NAT (Network Address Translation) table, and it is applied to packets after the routing decision has been made but before the packets are sent out of the system. The primary purpose of the POSTROUTING chain is to perform Source Network Address Translation (SNAT) or MASQUERADE on outgoing packets.

MASQUERADE Action
The MASQUERADE target in iptables is used for Network Address Translation (NAT) in order to hide the true source address of outgoing packets. Here, when the packet matches the conditions specified in an iptables rule with the MASQUERADE target, the source IP address of the packet is dynamically replaced with the IP address of the outgoing interface. The NAT engine on the router or gateway replaces the private source IP address with its own public IP address before forwarding the packet to the external network. When the external network sends a reply back to the public IP address, the NAT engine tracks the translation and forwards the reply back to the original private IP address within the internal network.

Firewall rules
sudo iptables -t nat -L -n -v
iptable

In case if still it not works then we may need to add some additional firewall rules.

sudo iptables --append FORWARD --in-interface br0 --jump ACCEPT
sudo iptables --append FORWARD --out-interface br0 --jump ACCEPT
These rules enabled traffic to travel across the br0 virtual bridge.These are useful to allow all traffic to pass through the br0 interface without any restrictions. However, keep in mind that using such rules without any filtering can expose your system to potential security risks. But for now we re good to ping!

Test Connectivity
ping 8.8.8.8 -c 5
ping-pong

Bingo!


---------


Puku CLI


1 hour 29 min


CONNECT TWO CUSTOM NETWORK NS

Shrink

Setting up Virtual Network between Namespaces
This guide outlines the steps to create two namespaces named blue-namespace and lemon-namespace, and establish a virtual Ethernet network between them using veth interfaces. The goal is to enable communication between the namespaces and allow them to ping each other.

Prerequisites
Linux operating system

Root or sudo access

Packages

sudo apt update
sudo apt upgrade -y
sudo apt install iproute2
sudo apt install net-tools
Steps
1. Enable IP forwarding in the Linux kernel:
sudo sysctl -w net.ipv4.ip_forward=1
This step enables IP forwarding in the Linux kernel, allowing the namespaces to communicate with each other.

2. Create namespaces:
Namespaces

sudo ip netns add blue-namespace
sudo ip netns add lemon-namespace
This step creates two namespaces named blue-namespace and lemon-namespace.

3. Create the virtual Ethernet link pair:
Veth Cable

sudo ip link add veth-blue type veth peer name veth-lemon
This command creates a virtual Ethernet link pair consisting of veth-blue and veth-lemon at root namespace.

In order to verify, run sudo ip link list

Expected Output:

6: veth-lemon@veth-blue: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 22:21:fc:9e:d0:2b brd ff:ff:ff:ff:ff:ff
7: veth-blue@veth-lemon: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 2e:34:8e:0c:1c:6e brd ff:ff:ff:ff:ff:ff
4. Set the cable as NIC
Nic

sudo ip link set veth-blue netns blue-namespace
sudo ip link set veth-lemon netns lemon-namespace
This command acts as NIC link pair consisting of veth-blue and veth-lemon.

To verify run sudo ip netns exec blue-namespace ip link and sudo ip netns exec lemon-namespace ip link

Expected Output

1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
7: veth-blue@if6: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 2e:34:8e:0c:1c:6e brd ff:ff:ff:ff:ff:ff link-netns lemon-namespace
and

1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
6: veth-lemon@if7: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 22:21:fc:9e:d0:2b brd ff:ff:ff:ff:ff:ff link-netns blue-namespace
But as we see, interface has been created but it's DOWN and has no ip. Now assign a ip address and turn it UP.

5. Assign IP Addresses to the Interfaces
Ip

sudo ip netns exec blue-namespace ip addr add 192.168.0.1/24 dev veth-blue
sudo ip netns exec lemon-namespace ip addr add 192.168.0.2/24 dev veth-lemon
In this step, IP addresses are assigned to the veth-blue interface in the blue-namespace and to the veth-lemon interface in the lemon-namespace.

To verify run sudo ip netns exec blue-namespace ip addr and sudo ip netns exec lemon-namespace ip addr

Expected Output:

7: veth-blue@if6: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 2e:34:8e:0c:1c:6e brd ff:ff:ff:ff:ff:ff link-netns lemon-namespace
    inet 192.168.0.1/24 scope global veth-blue
       valid_lft forever preferred_lft forever
and

6: veth-lemon@if7: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 22:21:fc:9e:d0:2b brd ff:ff:ff:ff:ff:ff link-netns blue-namespace
    inet 192.168.0.2/24 scope global veth-lemon
       valid_lft forever preferred_lft forever
6. Set the Interfaces Up
Interface

sudo ip netns exec blue-namespace ip link set veth-blue up
sudo ip netns exec lemon-namespace ip link set veth-lemon up
These commands set the veth-blue and veth-lemon interfaces up, enabling them to transmit and receive data.

Now run again sudo ip netns exec blue-namespace ip link and sudo ip netns exec lemon-namespace ip link to verify

Expected Output:

7: veth-blue@if6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000
    link/ether 2e:34:8e:0c:1c:6e brd ff:ff:ff:ff:ff:ff link-netns lemon-namespace
and

6: veth-lemon@if7: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000
    link/ether 22:21:fc:9e:d0:2b brd ff:ff:ff:ff:ff:ff link-netns blue-namespace
7. Set Default Routes
sudo ip netns exec blue-namespace ip route add default via 192.168.0.1 dev veth-blue
sudo ip netns exec lemon-namespace ip route add default via 192.168.0.2 dev veth-lemon
These commands set the default routes within each namespace, allowing them to route network traffic.

In order to verify run sudo ip netns exec blue-namespace ip route and sudo ip netns exec lemon-namespace ip route

Expected Output:

default via 192.168.0.1 dev veth-blue 
192.168.0.0/24 dev veth-blue proto kernel scope link src 192.168.0.1
and

default via 192.168.0.2 dev veth-lemon 
192.168.0.0/24 dev veth-lemon proto kernel scope link src 192.168.0.2
In addition, the route command in the context of the ip netns exec allows you to view the routing table of a specific network namespace. The routing table contains information about how network traffic should be forwarded or delivered.
To view the routing table of the lemon-namespace, you can execute the following command:

sudo ip netns exec lemon-namespace route
Output

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         192.168.0.2     0.0.0.0         UG    0      0        0 veth-lemon
192.168.0.0     0.0.0.0         255.255.255.0   U     0      0        0 veth-lemon
To view the routing table of the blue-namespace, you can execute the following command:

sudo ip netns exec blue-namespace route
Output

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         192.168.0.1     0.0.0.0         UG    0      0        0 veth-blue
192.168.0.0     0.0.0.0         255.255.255.0   U     0      0        0 veth-blue
8. Test Connectivity
sudo ip netns exec blue-namespace ping 192.168.0.2
sudo ip netns exec lemon-namespace ping 192.168.0.1
Use these commands to test the connectivity between the namespaces by pinging each other's IP address.

Expected Output:

PING 192.168.0.2 (192.168.0.2) 56(84) bytes of data.
64 bytes from 192.168.0.2: icmp_seq=1 ttl=64 time=0.024 ms
64 bytes from 192.168.0.2: icmp_seq=2 ttl=64 time=0.069 ms
64 bytes from 192.168.0.2: icmp_seq=3 ttl=64 time=0.063 ms
64 bytes from 192.168.0.2: icmp_seq=4 ttl=64 time=0.064 ms
64 bytes from 192.168.0.2: icmp_seq=5 ttl=64 time=0.063 ms
^C
--- 192.168.0.2 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4099ms
rtt min/avg/max/mdev = 0.024/0.056/0.069/0.016 ms
and

PING 192.168.0.1 (192.168.0.1) 56(84) bytes of data.
64 bytes from 192.168.0.1: icmp_seq=1 ttl=64 time=0.033 ms
64 bytes from 192.168.0.1: icmp_seq=2 ttl=64 time=0.072 ms
64 bytes from 192.168.0.1: icmp_seq=3 ttl=64 time=0.071 ms
64 bytes from 192.168.0.1: icmp_seq=4 ttl=64 time=0.074 ms
64 bytes from 192.168.0.1: icmp_seq=5 ttl=64 time=0.070 ms
^C
--- 192.168.0.1 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4099ms
rtt min/avg/max/mdev = 0.033/0.064/0.074/0.015 ms
Furthermore, the arp command in the context of the ip netns exec allows you to view the ARP cache of a specific network namespace. The ARP cache contains mappings of IP addresses to MAC addresses.
To view the ARP cache of the blue-namespace, you can execute the following command:

sudo ip netns exec blue-namespace arp
Output

Address                  HWtype  HWaddress           Flags Mask            Iface
127.0.0.53                       (incomplete)                              veth-blue
192.168.0.2              ether   22:21:fc:9e:d0:2b   C                     veth-blue
To view the ARP cache of the lemon-namespace, you can execute the following command:

sudo ip netns exec lemon-namespace arp
Output

Address                  HWtype  HWaddress           Flags Mask            Iface
192.168.0.1              ether   2e:34:8e:0c:1c:6e   C                     veth-lemon
127.0.0.53                       (incomplete)                              veth-lemon
9. Clean Up (optional)
sudo ip netns del blue-namespace
sudo ip netns del lemon-namespace
If you want to remove the namespaces run these commands to clean up the setup.




---------


Puku CLI


1 hour 29 min


BRIDGE NETWORKING AMONG NAMESPACES

Shrink

Setting up Linux Bridge Network among Namespaces
This guide outlines the steps to create three namespaces named blue-ns, gray-ns and lime-ns. Then establish a linux bridge network among them using veth interfaces. The goal is to enable communication among the namespaces and allow them to ping each other.

Prerequisites
Linux operating system

Root or sudo access

Packages

sudo apt update
sudo apt upgrade -y
sudo apt install iproute2
sudo apt install net-tools
Step 1: Create a Linux bridge:
Linux-bridge

sudo ip link add dev v-net type bridge
Lets run sudo ip links show to check and the expected output might look like

12: v-net: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether d2:22:49:28:a4:c8 brd ff:ff:ff:ff:ff:ff
But here v-net is now in down state. So lets turn into up.

sudo ip link set dev v-net up
and now expected output might look like

12: v-net: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default qlen 1000
    link/ether d2:22:49:28:a4:c8 brd ff:ff:ff:ff:ff:ff
Here, the "UP" flag indicates that the interface is enabled and operational, while the "DOWN" state indicates that the interface is currently inactive or not functioning as there is no any physical connectivity of the interface right now.

Step 2: Assign an IP address to the bridge interface 'v-net':
sudo ip address add 10.0.0.1/24 dev v-net
Run sudo ip addr show dev v-net

12: v-net: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether d2:22:49:28:a4:c8 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.1/24 scope global v-net
       valid_lft forever preferred_lft forever
Step 3: Create three network namespaces:
Namespaces

sudo ip netns add blue-ns
sudo ip netns add gray-ns
sudo ip netns add lime-ns
Run sudo ip netns list to check the list of namespaces.

Step 4: Create virtual Ethernet pairs:
Veth Cables

sudo ip link add veth-blue-ns type veth peer name veth-blue-br
sudo ip link add veth-gray-ns type veth peer name veth-gray-br
sudo ip link add veth-lime-ns type veth peer name veth-lime-br
Each cable now has two ends. Before connecting them to the appropriate bridge and namespaces, run sudo ip link show command to verify if the cables have been successfully created. Expected Output

13: veth-blue-br@veth-blue-ns: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether fa:b8:a7:3c:41:0a brd ff:ff:ff:ff:ff:ff
14: veth-blue-ns@veth-blue-br: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether ea:ff:ec:28:f3:aa brd ff:ff:ff:ff:ff:ff
15: veth-gray-br@veth-gray-ns: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether be:2a:cb:68:4d:18 brd ff:ff:ff:ff:ff:ff
16: veth-gray-ns@veth-gray-br: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 1a:08:51:d7:ab:95 brd ff:ff:ff:ff:ff:ff
17: veth-lime-br@veth-lime-ns: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 02:9a:fd:3e:85:8a brd ff:ff:ff:ff:ff:ff
18: veth-lime-ns@veth-lime-br: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether fe:c0:37:07:25:e4 brd ff:ff:ff:ff:ff:ff
Step 5: Move each end of veth cable to a different namespace:
sudo ip link set dev veth-blue-ns netns blue-ns
sudo ip link set dev veth-gray-ns netns gray-ns
sudo ip link set dev veth-lime-ns netns lime-ns
Run sudo ip netns exec <namespace-name> ip link show to verify

Step 6: Add the other end of the virtual interfaces to the bridge:
Interfaces

sudo ip link set dev veth-blue-br master v-net
sudo ip link set dev veth-gray-br master v-net
sudo ip link set dev veth-lime-br master v-net
Again run sudo ip link show command to verify.

Step 7: Set the bridge interfaces up:
sudo ip link set dev veth-blue-br up
sudo ip link set dev veth-gray-br up
sudo ip link set dev veth-lime-br up
Run sudo ip link show and expected output might look like

13: veth-blue-br@if14: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue master v-net state LOWERLAYERDOWN mode DEFAULT group default qlen 1000
    link/ether fa:b8:a7:3c:41:0a brd ff:ff:ff:ff:ff:ff link-netns blue-ns
15: veth-gray-br@if16: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue master v-net state LOWERLAYERDOWN mode DEFAULT group default qlen 1000
    link/ether be:2a:cb:68:4d:18 brd ff:ff:ff:ff:ff:ff link-netns gray-ns
17: veth-lime-br@if18: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue master v-net state LOWERLAYERDOWN mode DEFAULT group default qlen 1000
    link/ether 02:9a:fd:3e:85:8a brd ff:ff:ff:ff:ff:ff link-netns lime-ns
The "LOWERLAYERDOWN" state typically applies to virtual interfaces that are dependent on another interface or component. If one end is not currently in the 'up' state, it suggests that there may be an issue with the namespaces at that end (in our case).

Step 8: Set the namespace interfaces up:
sudo ip netns exec blue-ns ip link set dev veth-blue-ns up
sudo ip netns exec gray-ns ip link set dev veth-gray-ns up
sudo ip netns exec lime-ns ip link set dev veth-lime-ns up
Now, run sudo ip link show command again and it should show all interfaces are currently in UP state.

Step 9: Assign IP addresses to the virtual interfaces within each namespace and set the default routes:
Ip address

In the blue-ns namespace:
sudo ip netns exec blue-ns ip address add 10.0.0.11/24 dev veth-blue-ns
sudo ip netns exec blue-ns ip route add default via 10.0.0.1
In the gray-ns namespace:
sudo ip netns exec gray-ns ip address add 10.0.0.21/24 dev veth-gray-ns
sudo ip netns exec gray-ns ip route add default via 10.0.0.1
In the lime-ns namespace:
sudo ip netns exec lime-ns ip address add 10.0.0.31/24 dev veth-lime-ns
sudo ip netns exec lime-ns ip route add default via 10.0.0.1
Step 10: Firewall rules:
sudo iptables --append FORWARD --in-interface v-net --jump ACCEPT
sudo iptables --append FORWARD --out-interface v-net --jump ACCEPT
These rules enabled traffic to travel across the v-net virtual bridge.These are useful to allow all traffic to pass through the v-net interface without any restrictions.However, keep in mind that using such rules without any filtering can expose your system to potential security risks. But for now we re good to ping!

Test Connectivity
Ping

sudo ip netns exec lime-ns ping -c 2 10.0.0.11
Expected Output

PING 10.0.0.11 (10.0.0.11) 56(84) bytes of data.
64 bytes from 10.0.0.11: icmp_seq=1 ttl=64 time=0.064 ms
64 bytes from 10.0.0.11: icmp_seq=2 ttl=64 time=0.169 ms

--- 10.0.0.11 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1006ms
rtt min/avg/max/mdev = 0.064/0.116/0.169/0.052 ms
Another one:

sudo ip netns exec gray-ns ping -c 2 10.0.0.11
Expected Output

PING 10.0.0.11 (10.0.0.11) 56(84) bytes of data.
64 bytes from 10.0.0.11: icmp_seq=1 ttl=64 time=0.051 ms
64 bytes from 10.0.0.11: icmp_seq=2 ttl=64 time=0.112 ms

--- 10.0.0.11 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1024ms
rtt min/avg/max/mdev = 0.051/0.081/0.112/0.030 ms
Another one:

sudo ip netns exec blue-ns ping -c 2 10.0.0.21
Expected Output

PING 10.0.0.21 (10.0.0.21) 56(84) bytes of data.
64 bytes from 10.0.0.21: icmp_seq=1 ttl=64 time=0.056 ms
64 bytes from 10.0.0.21: icmp_seq=2 ttl=64 time=0.109 ms

--- 10.0.0.21 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1018ms
rtt min/avg/max/mdev = 0.056/0.082/0.109/0.026 ms
Another one:

sudo ip netns exec blue-ns ping -c 2 10.0.0.31
Expected Output

PING 10.0.0.31 (10.0.0.31) 56(84) bytes of data.
64 bytes from 10.0.0.31: icmp_seq=1 ttl=64 time=0.073 ms
64 bytes from 10.0.0.31: icmp_seq=2 ttl=64 time=0.127 ms

--- 10.0.0.31 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1031ms
rtt min/avg/max/mdev = 0.073/0.100/0.127/0.027 ms
In addition, the route command in the context of the ip netns exec allows you to view the routing table of a specific network namespace. The routing table contains information about how network traffic should be forwarded or delivered.
To view the routing table of the blue-ns namespace, execute the following command:

sudo ip netns exec blue-ns route
Output:

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         10.0.0.1        0.0.0.0         UG    0      0        0 veth-blue-ns
10.0.0.0        0.0.0.0         255.255.255.0   U     0      0        0 veth-blue-ns
To view the routing table of the gray-ns namespace, execute the following command:

sudo ip netns exec gray-ns route
Output:

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         10.0.0.1        0.0.0.0         UG    0      0        0 veth-gray-ns
10.0.0.0        0.0.0.0         255.255.255.0   U     0      0        0 veth-gray-ns
To view the routing table of the lime-ns namespace, execute the following command:

sudo ip netns exec lime-ns route
Output:

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         10.0.0.1        0.0.0.0         UG    0      0        0 veth-lime-ns
10.0.0.0        0.0.0.0         255.255.255.0   U     0      0        0 veth-lime-ns
Furthermore, the arp command in the context of the ip netns exec allows you to view the ARP cache of a specific network namespace. The ARP cache contains mappings of IP addresses to MAC addresses.
To view the ARP cache of the blue-ns namespace, execute the following command:

sudo ip netns exec blue-ns arp
Output

Address                  HWtype  HWaddress           Flags Mask            Iface
10.0.0.1                 ether   d2:22:49:28:a4:c8   C                     veth-blue-ns
10.0.0.31                ether   fe:c0:37:07:25:e4   C                     veth-blue-ns
10.0.0.21                ether   1a:08:51:d7:ab:95   C                     veth-blue-ns
To view the ARP cache of the gray-ns namespace, execute the following command:

sudo ip netns exec gray-ns arp
Output

Address                  HWtype  HWaddress           Flags Mask            Iface
10.0.0.1                 ether   d2:22:49:28:a4:c8   C                     veth-gray-ns
10.0.0.11                ether   ea:ff:ec:28:f3:aa   C                     veth-gray-ns
To view the ARP cache of the lime-ns namespace, execute the following command:

sudo ip netns exec lime-ns arp
Output

Address                  HWtype  HWaddress           Flags Mask            Iface
10.0.0.1                 ether   d2:22:49:28:a4:c8   C                     veth-lime-ns
10.0.0.11                ether   ea:ff:ec:28:f3:aa   C                     veth-lime-ns
Clean Up (optional)
sudo ip netns del <namespace>
sudo ip link delete <bridge network name> type bridge
If you want to remove the namespaces and bridge network device run these commands to clean up the setup.


-------------


Puku CLI


1 hour 29 min


PROCESS COMMUNICATION BETWEEN NAMESPACES

Shrink

Communicating between process and different namespaces.
This guide outlines the steps to create two namespaces named blue-namespace and lemon-namespace, and establish a virtual Ethernet network between them using veth interfaces. The goal is to enable communication between the namespaces and process. Besides allowing them to ping or curl from one namespace to process.

Prerequisites
Linux operating system

Root or sudo access

Packages

sudo apt update
sudo apt upgrade -y
sudo apt install iproute2
sudo apt install net-tools
Steps
1. Enable IP forwarding in the Linux kernel:
sudo sysctl -w net.ipv4.ip_forward=1
This step enables IP forwarding in the Linux kernel, allowing the namespaces to communicate with each other.

2. Create namespaces:
Namespaces

sudo ip netns add blue-namespace
sudo ip netns add lemon-namespace
This step creates two namespaces named blue-namespace and lemon-namespace. We can list our namespaces by running ip netns list.

namespaces

3. Create the virtual Ethernet link pair:
Veth Cable

sudo ip link add veth-blue type veth peer name veth-lemon
This command creates a virtual Ethernet link pair consisting of veth-blue and veth-lemon at root namespace.

In order to verify, run sudo ip link list

Expected Output:

veth-cable

4. Set the cable as NIC
Nic

sudo ip link set veth-blue netns blue-namespace
sudo ip link set veth-lemon netns lemon-namespace
This command acts as NIC link pair consisting of veth-blue and veth-lemon.

To verify run sudo ip netns exec blue-namespace ip link and sudo ip netns exec lemon-namespace ip link

Expected Output

nic

But as we see, interface has been created but it's DOWN and has no ip. Now assign a ip address and turn it UP.

5. Assign IP Addresses to the Interfaces
Ip

sudo ip netns exec blue-namespace ip addr add 192.168.0.1/24 dev veth-blue
sudo ip netns exec lemon-namespace ip addr add 192.168.0.2/24 dev veth-lemon
In this step, IP addresses are assigned to the veth-blue interface in the blue-namespace and to the veth-lemon interface in the lemon-namespace.

To verify run sudo ip netns exec blue-namespace ip addr and sudo ip netns exec lemon-namespace ip addr

Expected Output:ip-addr

6. Set the Interfaces Up
Interface

sudo ip netns exec blue-namespace ip link set veth-blue up
sudo ip netns exec lemon-namespace ip link set veth-lemon up
These commands set the veth-blue and veth-lemon interfaces up, enabling them to transmit and receive data.

Now run again sudo ip netns exec blue-namespace ip link and sudo ip netns exec lemon-namespace ip link to verify

Expected Output:interfaces-up

7. Set Default Routes
sudo ip netns exec blue-namespace ip route add default via 192.168.0.1 dev veth-blue
sudo ip netns exec lemon-namespace ip route add default via 192.168.0.2 dev veth-lemon
These commands set the default routes within each namespace, allowing them to route network traffic.

In order to verify run sudo ip netns exec blue-namespace ip route and sudo ip netns exec lemon-namespace ip route

Expected Output:default-route

In addition, the route command in the context of the ip netns exec allows you to view the routing table of a specific network namespace. The routing table contains information about how network traffic should be forwarded or delivered.
To view the routing table of the lemon-namespace, we can execute the following command:

sudo ip netns exec lemon-namespace route
sudo ip netns exec blue-namespace route
Outputroute

8. Test Connectivity
sudo ip netns exec blue-namespace ping 192.168.0.2
sudo ip netns exec lemon-namespace ping 192.168.0.1
Use these commands to test the connectivity between the namespaces by pinging each other's IP address.

Expected Output:ping-pong

9. Create a server and run
Now we are ready to create a server inside one namespace and ping or curl from another namespace. Let's create a simple hello-world flask application.

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
Use sudo nano server.py and write down these lines. Press control+O , Enter and control+X.

server.py

To run this server we need to create virtual environment and install packages.

python3 -m venv venv
source venv/bin/activate
pip3 install flask
flask

Run python3 server.py, but before that, we need to enter the inside of one namespace. Let's try with blue namespace.

sudo ip netns exec blue-namespace /bin/bash
Lets check the ip info. Run ifconfig.

ifconfig

Now lets run the application.

source venv/bin/activate
python3 server.py
run application

10. Now let's curl from another namespace
Let's get into lemon namespace. Run sudo ip netns exec lemon-namespace /bin/bash. Run ifconfig

lemon ns

curl -v http://192.168.0.1:3000
hello-world

Hurray.....!

11. Let's create one more server
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello world from process 2'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
Run it from the blue namespace and curl again from the lemon namespace.

application2

curl -v http://192.168.0.1:3001
process-2

Holaa...!

12. Clean Up (optional)
sudo ip netns del blue-namespace
sudo ip netns del lemon-namespace
If you want to remove the namespaces run these commands to clean up the setup.



------------------



Puku CLI


1 hour 59 min


FIB NETWORK TOPOLOGY

Shrink
FIB (Forward Information Base)
How FIB network architecture generally works:
FIB Overview:
The Forwarding Information Base (FIB) is a table used by routers to determine packet forwarding.
It contains mappings of destination network addresses to the next-hop router or interface.
Populating the FIB:
FIB entries are populated through routing protocols such as OSPF, RIP, and BGP.
These protocols exchange routing information among routers to build and update the FIB.
Forwarding Decisions:
When a router receives an incoming packet, it examines the destination IP address.
The router looks up the destination address in its FIB.
If a matching entry is found in the FIB, the router forwards the packet based on the next-hop information specified in the FIB entry.
If no matching entry is found, the router typically either drops the packet or forwards it to a default route if configured.
Proposed network topology:
topology

How the FIB works in our environment:
1. Router Configuration:

In our setup, the router namespace is acting as a router between the red and blue namespaces.
The router's FIB contains information about the next-hop IP addresses for each destination network.
When a packet arrives at the router, it consults its FIB to determine the next-hop interface and IP address for the packet.
Routing Table:

The routing table in the router namespace contains the routing information used to populate the FIB.
Entries in the routing table specify the destination network (e.g., 10.11.0.0/24 for the red namespace and 10.12.0.0/24 for the blue namespace) and the next-hop IP address for each network.
The router uses this routing table to populate its FIB with the necessary forwarding information.
Mac Address table:

Arp Table

Routing table:

Routing Table

Packet Forwarding:

When a packet arrives at the router, it performs a lookup in its FIB to determine the next-hop interface and IP address for the packet's destination.
Based on the information in the FIB, the router forwards the packet to the appropriate interface.
If the packet's destination is within the same network (e.g., from red to router), the router forwards the packet directly to the destination host without further routing.
Connectivity:

Connectivity