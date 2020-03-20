# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = 'ubuntu/bionic64'

  unless Vagrant.has_plugin?("vagrant-hostupdater")
    config.vm.hostname = "dev.print4.health"
  end

  # API calls
  config.vm.network :forwarded_port, guest: 80, host: 8888

  # mailcatcher
  config.vm.network :forwarded_port, guest: 1080, host: 1080

  config.vm.network :private_network, ip: "192.168.222.12"
  config.vm.synced_folder "./", "/srv/share", id: 'vagrant-share', :nfs => true
  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.ssh.forward_agent = true
  config.ssh.insert_key = false

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end

  config.vm.provision 'ansible_local' do |ansible|
    ansible.provisioning_path  = '/srv/share/ansible'
    ansible.playbook           = 'site.yml'
    ansible.inventory_path     = 'inventory/devbox/hosts'
    ansible.limit              = 'devbox'
    ansible.compatibility_mode = '2.0'
  end
end
