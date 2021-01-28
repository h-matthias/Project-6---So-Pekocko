/** Fonction de masquage pour email **/
exports.maskEmail = (email) => {
    let  part1 = email.split("@")[0];
    let part2 = email.split("@")[1];
    let reversPart1 = part1.split("").reverse().join('');
    let revEmail = reversPart1+"@"+part2;
    return revEmail;
}